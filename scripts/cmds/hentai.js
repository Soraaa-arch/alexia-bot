const axios = require("axios");
const fs = require("fs");
const path = require("path");

// --- 🎯 Anilist GraphQL Query for Search ---
const SEARCH_QUERY = `
query ($search: String) {
  Page(perPage: 5) {
    media(search: $search, type: MANGA, sort: [POPULARITY_DESC]) {
      id
      title {
        romaji
        english
      }
      coverImage {
        extraLarge
      }
      chapters
      status
      volumes
      description(asHtml: false)
    }
  }
}
`;

/**
 * Searches the Anilist API for manga matching the query.
 * @param {string} query The manga title to search for.
 * @returns {Array<object>} An array of up to 5 manga objects.
 */
async function fetchMangaList(query) {
  try {
    const response = await axios.post('https://graphql.anilist.co', {
      query: SEARCH_QUERY,
      variables: { search: query }
    });
    
    // Check for GraphQL errors
    if (response.data.errors) {
        throw new Error(`Anilist API Error: ${response.data.errors.map(e => e.message).join(", ")}`);
    }

    return response.data.data.Page.media || [];
  } catch (error) {
    console.error("Manga Search Error:", error.message);
    throw new Error("Failed to fetch manga list from Anilist.");
  }
}

/**
 * Downloads a cover image and saves it to the cache directory.
 * @param {string} posterUrl The URL of the image.
 * @param {string} fileName The full path/filename to save the image.
 * @returns {Promise<string>} A promise that resolves with the saved filename.
 */
async function downloadCover(posterUrl, fileName) {
  try {
    const cacheDir = path.join(__dirname, 'cache');
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    const response = await axios.get(posterUrl, { responseType: "stream" });
    const writer = fs.createWriteStream(fileName);
    response.data.pipe(writer);
    
    return new Promise((resolve, reject) => {
      writer.on("finish", () => resolve(fileName));
      writer.on("error", reject);
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to download cover image.");
  }
}

/**
 * Utility to clean up HTML tags from the description.
 * @param {string} html The raw description string.
 * @returns {string} The cleaned string.
 */
function stripHtml(html) {
    return html ? html.replace(/<[^>]*>/g, '').replace(/&#039;/g, "'") : "N/A";
}


// --- 📜 Bot Command Module ---

module.exports = {
  config: {
    name: "hentai",
    author: "Hulaan mo",
    version: "1.0.1",
    cooldowns: 5,
    role: 0, 
    shortDescription: "Search for a manga series using Anilist.",
    longDescription: "Search for a manga by title and get detailed information and cover art.",
    category: "Media",
    guide: "{p}manga {query}",
  },

  onStart: async function ({ api, event, args }) {
    api.setMessageReaction("🔍", event.messageID, () => {}, true);

    try {
      const query = args.join(" ").trim();
      
      if (!query) {
        api.sendMessage({ body: `Please provide a manga title to search for. Example: {p}manga Jujutsu Kaisen` }, event.threadID, event.messageID);
        api.setMessageReaction("❌", event.messageID, () => {}, true);
        return;
      }

      const mangaList = await fetchMangaList(query);

      if (!Array.isArray(mangaList) || mangaList.length === 0) {
        api.sendMessage({ body: `❌ No manga found for "${query}".` }, event.threadID, event.messageID);
        api.setMessageReaction("❌", event.messageID, () => {}, true);
        return;
      }

      const mangaNames = mangaList.map((manga, index) => 
        `${index + 1}. ${manga.title.english || manga.title.romaji}`
      ).join("\n");
      
      const message = `📚 Found these manga (Top 5 results):\n\n${mangaNames}\n\nReply with the number of the manga you want details for.`;

      api.sendMessage({ body: message }, event.threadID, (err, info) => {
        if (!err) {
            global.GoatBot.onReply.set(info.messageID, {
              commandName: "manga",
              messageID: info.messageID,
              author: event.senderID,
              mangaList: mangaList, 
            });
        }
      });

      api.setMessageReaction("✅", event.messageID, () => {}, true);
    } catch (error) {
      console.error(error);
      api.sendMessage({ body: `An error occurred during the manga search: ${error.message}` }, event.threadID, event.messageID);
      api.setMessageReaction("❌", event.messageID, () => {}, true);
    }
  },

  onReply: async function ({ api, event, Reply, args }) {
    const { author, mangaList } = Reply;

    // Check if the reply is from the original author
    if (event.senderID !== author || !mangaList) {
      return;
    }

    const animeIndex = parseInt(args[0], 10);
    const selectedManga = mangaList[animeIndex - 1];

    if (!selectedManga) {
      api.sendMessage({ body: "Invalid input. Please provide a valid number from the list." }, event.threadID, event.messageID);
      return;
    }

    try {
      const title = selectedManga.title.english || selectedManga.title.romaji;
      const description = stripHtml(selectedManga.description);
      const coverUrl = selectedManga.coverImage.extraLarge;
      
      const posterFileName = path.join(__dirname, 'cache', `${Date.now()}_${selectedManga.id}.jpg`);
      await downloadCover(coverUrl, posterFileName);
      
      const posterStream = fs.createReadStream(posterFileName);
      
      const replyMessage = 
        `📖 **${title}**\n\n` + 
        `**Summary:** ${description.substring(0, 700)}...\n` + 
        `\n--- Details ---` +
        `\n• **Status:** ${selectedManga.status || 'N/A'}` +
        `\n• **Chapters:** ${selectedManga.chapters || 'N/A'}` +
        `\n• **Volumes:** ${selectedManga.volumes || 'N/A'}` +
        `\n• **Anilist ID:** ${selectedManga.id}`;

      api.sendMessage({ body: replyMessage, attachment: posterStream }, event.threadID, (err) => {
          // Clean up the downloaded file after sending
          if (fs.existsSync(posterFileName)) {
              fs.unlinkSync(posterFileName);
          }
      });
      
    } catch (error) {
      console.error(error);
      api.sendMessage({ body: "An error occurred while processing the manga details. Please try again later." }, event.threadID);
    } finally {
      // Clean up the reply handler regardless of success
      global.GoatBot.onReply.delete(event.messageID);
    }
  },
};
