module.exports = {
        config: {
                name: "trivia",
                version: "1.0",
                author: "NeoKEX",
                countDown: 5,
                role: 0,
                description: {
                        vi: "Trò chơi Trivia",
                        en: "Trivia Game"
                },
                category: "games",
                guide: {
                        vi: "   {pn} - Chơi Trivia",
                        en: "   {pn} - Play Trivia"
                }
        },

        langs: {
                vi: {
                        question: "❓ Câu hỏi: %1\n\n1️⃣ %2\n2️⃣ %3\n3️⃣ %4\n4️⃣ %5\n\nTrả lời: *trivia answer <số>",
                        correct: "✅ Đúng rồi!",
                        wrong: "❌ Sai rồi! Đáp án là: %1"
                },
                en: {
                        question: "❓ Question: %1\n\n1️⃣ %2\n2️⃣ %3\n3️⃣ %4\n4️⃣ %5\n\nAnswer: *trivia answer <number>",
                        correct: "✅ Correct!",
                        wrong: "❌ Wrong! The answer is: %1"
                }
        },

        onStart: async function ({ message, args, getLang, event, commandName }) {
                const questions = [
                        {
                                q: "What is the capital of France?",
                                opts: ["London", "Berlin", "Paris", "Madrid"],
                                ans: "Paris"
                        },
                        {
                                q: "Which planet is known as the Red Planet?",
                                opts: ["Venus", "Mars", "Jupiter", "Saturn"],
                                ans: "Mars"
                        },
                        {
                                q: "What is the largest ocean on Earth?",
                                opts: ["Atlantic", "Indian", "Arctic", "Pacific"],
                                ans: "Pacific"
                        },
                        {
                                q: "Who wrote Romeo and Juliet?",
                                opts: ["Jane Austen", "William Shakespeare", "Mark Twain", "Charles Dickens"],
                                ans: "William Shakespeare"
                        },
                        {
                                q: "What is the smallest prime number?",
                                opts: ["0", "1", "2", "3"],
                                ans: "2"
                        }
                ];

                const trivia = questions[Math.floor(Math.random() * questions.length)];

                if (!global.temp.triviaData) global.temp.triviaData = {};
                global.temp.triviaData[event.senderID] = trivia;

                return message.reply(getLang("question", trivia.q, trivia.opts[0], trivia.opts[1], trivia.opts[2], trivia.opts[3]), (err, info) => {
                        if (!err) {
                                global.GoatBot.onReply.set(info.messageID, {
                                        commandName,
                                        author: event.senderID,
                                        messageID: info.messageID
                                });
                        }
                });
        },

        onReply: async function ({ Reply, message, event, args, getLang, usersData }) {
                const answer = args[0];
                if (!answer) return message.reply("Please provide an answer!");

                const userTrivia = global.temp.triviaData[event.senderID];
                if (!userTrivia) return message.reply("No trivia found!");

                const answerNum = parseInt(answer) - 1;
                if (answerNum < 0 || answerNum > 3) return message.reply("Invalid answer!");

                const userAnswer = userTrivia.opts[answerNum];
                if (userAnswer === userTrivia.ans) {
                        // Add coin reward for correct answer
                        const reward = 50;
                        let userData = await usersData.get(event.senderID, "data.economy");
                        if (!userData) userData = { wallet: 0, bank: 0 };
                        userData.wallet = (userData.wallet || 0) + reward;
                        await usersData.set(event.senderID, userData, "data.economy");
                        
                        delete global.temp.triviaData[event.senderID];
                        return message.reply(getLang("correct") + "\n\n💰 +" + reward + " coins!");
                } else {
                        delete global.temp.triviaData[event.senderID];
                        return message.reply(getLang("wrong", userTrivia.ans));
                }
        }
};
