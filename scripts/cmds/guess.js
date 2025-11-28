module.exports = {
        config: {
                name: "guess",
                version: "1.0",
                author: "NeoKEX",
                countDown: 5,
                role: 0,
                description: {
                        vi: "Đoán số từ 1-100",
                        en: "Guess the number 1-100"
                },
                category: "games",
                guide: {
                        vi: "   {pn} start - Bắt đầu chơi\n   {pn} <số> - Đoán số",
                        en: "   {pn} start - Start game\n   {pn} <number> - Guess number"
                }
        },

        langs: {
                vi: {
                        started: "🎮 Trò chơi bắt đầu! Hãy đoán một số từ 1-100\nGợi ý: *guess <số>",
                        higher: "📈 Số bạn đoán quá nhỏ! Hãy đoán cao hơn",
                        lower: "📉 Số bạn đoán quá lớn! Hãy đoán thấp hơn",
                        won: "🎉 Chính xác! Bạn thắng! Số đó là: %1",
                        attempts: "Số lần thử: %1",
                        noGame: "Không có trò chơi nào! Sử dụng *guess start để bắt đầu"
                },
                en: {
                        started: "🎮 Game started! Guess a number from 1-100\nTip: *guess <number>",
                        higher: "📈 Too low! Guess higher",
                        lower: "📉 Too high! Guess lower",
                        won: "🎉 Correct! You won! The number was: %1",
                        attempts: "Attempts: %1",
                        noGame: "No game found! Use *guess start to begin"
                }
        },

        onStart: async function ({ message, args, getLang, event, usersData }) {
                if (args[0]?.toLowerCase() === "start") {
                        if (!global.temp.guessGame) global.temp.guessGame = {};
                        global.temp.guessGame[event.senderID] = {
                                number: Math.floor(Math.random() * 100) + 1,
                                attempts: 0
                        };
                        return message.reply(getLang("started"));
                }

                const num = parseInt(args[0]);
                if (!num) return message.reply(getLang("noGame"));

                const game = global.temp.guessGame?.[event.senderID];
                if (!game) return message.reply(getLang("noGame"));

                game.attempts++;

                if (num === game.number) {
                        delete global.temp.guessGame[event.senderID];
                        
                        // Reward coins - fewer attempts = more coins
                        const reward = Math.max(50, 100 - (game.attempts * 5));
                        let userData = await usersData.get(event.senderID, "data.economy");
                        if (!userData) userData = { wallet: 0, bank: 0 };
                        userData.wallet = (userData.wallet || 0) + reward;
                        await usersData.set(event.senderID, userData, "data.economy");
                        
                        return message.reply(getLang("won", game.number) + "\n" + getLang("attempts", game.attempts) + "\n\n💰 +"+reward+" coins earned!");
                } else if (num < game.number) {
                        return message.reply(getLang("higher") + "\n" + getLang("attempts", game.attempts));
                } else {
                        return message.reply(getLang("lower") + "\n" + getLang("attempts", game.attempts));
                }
        }
};
