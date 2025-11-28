module.exports = {
        config: {
                name: "balance",
                aliases: ["wallet", "coins"],
                version: "1.0",
                author: "Replit Agent",
                countDown: 2,
                role: 0,
                description: {
                        en: "Check your wallet balance"
                },
                category: "economy",
                guide: {
                        en: "   {pn} - Check your wallet coins"
                }
        },

        langs: {
                en: {
                        balance: "👛 WALLET BALANCE\n\n💰 Coins: %1\n\n💡 Tip: Use *bank to check bank\n💡 Tip: Use *send @user <amount> to send coins"
                }
        },

        onStart: async function ({ message, getLang, event, usersData }) {
                const userID = event.senderID;
                
                let userData = await usersData.get(userID, "data.economy");
                if (!userData) {
                        userData = { wallet: 0, bank: 0 };
                        await usersData.set(userID, userData, "data.economy");
                }

                const wallet = userData.wallet || 0;
                return message.reply(getLang("balance", wallet));
        }
};