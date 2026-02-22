module.exports = {
        config: {
                name: "20questions",
                aliases: ["20q"],
                version: "1.0",
                author: "Replit Agent",
                countDown: 5,
                role: 0,
                description: {
                        en: "20 Questions guessing game"
                },
                category: "games",
                guide: {
                        en: "   {pn} - Start 20 questions\n   {pn} guess <answer> - Make a guess"
                }
        },

        langs: {
                en: {
                        started: "🎮 20 QUESTIONS STARTED!\n\nI'm thinking of something. You have 20 yes/no questions.\nAsk questions in the chat and I'll answer!\n\nTo guess: *20questions guess <your answer>",
                        thinking: "I'm thinking... 🤔",
                        questions_left: "❓ Questions left: %1",
                        yes: "Yes! 👍",
                        no: "No! 👎",
                        correct: "🎉 YOU WIN! It was: %1",
                        wrong: "❌ WRONG! It was: %1",
                        noGame: "No active game! Use *20questions to start",
                        out_of_questions: "💀 OUT OF QUESTIONS! It was: %1"
                }
        },

        onStart: async function ({ message, getLang, event, commandName }) {
                const answers = [
                        "elephant", "smartphone", "pizza", "mountain", "ocean",
                        "airplane", "diamond", "telescope", "volcano", "robot",
                        "lighthouse", "spaceship", "library", "waterfall", "castle"
                ];

                const answer = answers[Math.floor(Math.random() * answers.length)];

                if (!global.temp.twentyQGames) global.temp.twentyQGames = {};
                
                global.temp.twentyQGames[event.senderID] = {
                        answer: answer,
                        questions: 0,
                        maxQuestions: 20
                };

                message.reply(getLang("started"), (err, info) => {
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
                const game = global.temp.twentyQGames?.[event.senderID];
                if (!game) return message.reply(getLang("noGame"));

                if (args[0]?.toLowerCase() === "guess") {
                        const guess = args.slice(1).join(" ").toLowerCase();
                        if (!guess) return message.reply("What's your guess?");

                        delete global.temp.twentyQGames[event.senderID];
                        if (guess === game.answer.toLowerCase()) {
                                // Add coin reward for correct guess
                                const reward = 75;
                                let userData = await usersData.get(event.senderID, "data.economy");
                                if (!userData) userData = { wallet: 0, bank: 0 };
                                userData.wallet = (userData.wallet || 0) + reward;
                                await usersData.set(event.senderID, userData, "data.economy");
                                
                                return message.reply(getLang("correct", game.answer) + "\n\n💰 +" + reward + " coins!");
                        } else {
                                return message.reply(getLang("wrong", game.answer));
                        }
                }

                // It's a yes/no question
                game.questions++;

                if (game.questions >= game.maxQuestions) {
                        delete global.temp.twentyQGames[event.senderID];
                        return message.reply(getLang("out_of_questions", game.answer));
                }

                // Simple random yes/no based on keywords
                const question = event.body?.toLowerCase() || "";
                const keywords = game.answer.split("");
                const isRelated = keywords.some(k => question.includes(k));
                
                const response = isRelated ? getLang("yes") : getLang("no");
                const remaining = game.maxQuestions - game.questions;

                message.reply(response + "\n" + getLang("questions_left", remaining), (err, info) => {
                        if (!err) {
                                global.GoatBot.onReply.set(info.messageID, {
                                        commandName: "20questions",
                                        author: event.senderID,
                                        messageID: info.messageID
                                });
                        }
                });
        }
};
