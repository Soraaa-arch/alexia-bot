module.exports = {
        config: {
                name: "coin",
                version: "1.0",
                author: "NeoKEX",
                countDown: 2,
                role: 0,
                description: {
                        vi: "Lật đồng xu",
                        en: "Flip a coin"
                },
                category: "games",
                guide: {
                        vi: "   {pn} - Lật đồng xu",
                        en: "   {pn} - Flip a coin"
                }
        },

        langs: {
                vi: {
                        heads: "🪙 Mặt ngửa!",
                        tails: "🪙 Mặt sấp!"
                },
                en: {
                        heads: "🪙 Heads!",
                        tails: "🪙 Tails!"
                }
        },

        onStart: async function ({ message, getLang, event, usersData }) {
                const result = Math.random() < 0.5;
                const text = result ? getLang("heads") : getLang("tails");
                
                // Add coin reward
                const reward = 15;
                let userData = await usersData.get(event.senderID, "data.economy");
                if (!userData) userData = { wallet: 0, bank: 0 };
                userData.wallet = (userData.wallet || 0) + reward;
                await usersData.set(event.senderID, userData, "data.economy");
                
                return message.reply(text + "\n\n💰 +" + reward + " coins!");
        }
};
