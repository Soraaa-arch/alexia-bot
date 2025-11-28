module.exports = {
        config: {
                name: "wordchain",
                aliases: ["wordassoc", "wa"],
                version: "1.0",
                author: "Replit Agent",
                countDown: 3,
                role: 0,
                description: {
                        en: "Word chain association game"
                },
                category: "games",
                guide: {
                        en: "   {pn} - Start word chain\n   {pn} <word> - Add a related word"
                }
        },

        langs: {
                en: {
                        started: "🎮 WORD CHAIN STARTED!\n\nI start with: %1\n\nPlayers add related words!\nReply: *wordchain <word>",
                        chain: "Chain: %1",
                        added: "✅ %1 added!",
                        invalid: "❌ Word must be connected to the chain!",
                        noGame: "No active game! Use *wordchain to start",
                        timeout: "⏰ Game ended! Final chain:\n%1"
                }
        },

        onStart: async function ({ message, getLang, event, commandName }) {
                const startWords = [
                        "apple", "ocean", "music", "adventure", "dream",
                        "technology", "nature", "fantasy", "mystery", "journey"
                ];

                const word = startWords[Math.floor(Math.random() * startWords.length)];

                if (!global.temp.wordchainGames) global.temp.wordchainGames = {};
                
                global.temp.wordchainGames[event.senderID] = {
                        chain: [word],
                        lastWord: word,
                        players: new Set()
                };

                message.reply(getLang("started", word) + "\n" + getLang("chain", word), (err, info) => {
                        if (!err) {
                                global.GoatBot.onReply.set(info.messageID, {
                                        commandName,
                                        author: event.senderID,
                                        messageID: info.messageID
                                });
                        }
                });
        },

        onReply: async function ({ message, event, args, getLang, usersData }) {
                const game = global.temp.wordchainGames?.[event.senderID];
                if (!game) return message.reply(getLang("noGame"));

                const newWord = args[0]?.toLowerCase();
                if (!newWord) return message.reply("Enter a word!");

                // Check if word is related to previous word (simple check - first/last letter match or shares letters)
                const lastWord = game.lastWord;
                const isRelated = 
                        lastWord[lastWord.length - 1] === newWord[0] || // Ends with same letter that starts new word
                        lastWord.split("").some(l => newWord.includes(l)); // Shares letters

                if (!isRelated) {
                        return message.reply(getLang("invalid"));
                }

                // Add coin reward
                const reward = 10;
                let userData = await usersData.get(event.senderID, "data.economy");
                if (!userData) userData = { wallet: 0, bank: 0 };
                userData.wallet = (userData.wallet || 0) + reward;
                await usersData.set(event.senderID, userData, "data.economy");

                game.chain.push(newWord);
                game.lastWord = newWord;
                game.players.add(event.senderID);

                message.reply(
                        getLang("added", newWord) + "\n" +
                        getLang("chain", game.chain.join(" → ")) + "\n\n💰 +" + reward + " coins!",
                        (err, info) => {
                                if (!err) {
                                        global.GoatBot.onReply.set(info.messageID, {
                                                commandName: "wordchain",
                                                author: event.senderID,
                                                messageID: info.messageID
                                        });
                                }
                        }
                );
        }
};
