module.exports = {
        config: {
                name: "spinwheel",
                aliases: ["wheel", "spin"],
                version: "1.0",
                author: "Replit Agent 💝",
                countDown: 3,
                role: 0,
                description: {
                        vi: "Quay bánh xe may mắn",
                        en: "Spin the lucky wheel"
                },
                category: "games",
                guide: {
                        vi: "   {pn} - Quay bánh xe",
                        en: "   {pn} - Spin the wheel"
                }
        },

        langs: {
                vi: {
                        spinning: "🎡 Bánh xe đang quay...",
                        result: "🎉 KẾT QUẢ: %1"
                },
                en: {
                        spinning: "🎡 Wheel is spinning...",
                        result: "🎉 RESULT: %1"
                }
        },

        onStart: async function ({ message, getLang, event, usersData }) {
                const rewards = [
                        "💰 Rich! You got $999,999",
                        "🍕 Free Pizza for a Month!",
                        "🎮 New Gaming Console!",
                        "✈️ Vacation to Hawaii!",
                        "📱 Brand New iPhone!",
                        "🎵 Concert Tickets!",
                        "💎 Diamond Ring!",
                        "🚗 Luxury Car!",
                        "🏖️ Beach House!",
                        "🍣 5-Star Restaurant Gift Card!",
                        "🎸 Electric Guitar!",
                        "🖥️ Gaming PC!",
                        "⌚ Rolex Watch!",
                        "🐕 Cute Puppy!",
                        "🎓 Scholarship!",
                        "💪 Superhero Powers!",
                        "🦸 Time Travel!",
                        "🌟 Become a Celebrity!",
                        "🧠 Genius Brain!",
                        "😎 Cool Sunglasses (and attitude)!"
                ];

                // Spinning animation
                message.reply(getLang("spinning"));

                // Simulate spinning delay
                await new Promise(resolve => setTimeout(resolve, 2000));

                const winner = rewards[Math.floor(Math.random() * rewards.length)];
                
                // Add coin reward (random 20-100)
                const reward = Math.floor(Math.random() * 80) + 20;
                let userData = await usersData.get(event.senderID, "data.economy");
                if (!userData) userData = { wallet: 0, bank: 0 };
                userData.wallet = (userData.wallet || 0) + reward;
                await usersData.set(event.senderID, userData, "data.economy");
                
                let celebration = "";
                const rand = Math.random();
                if (rand < 0.3) celebration = "🎊🎉🎊";
                else if (rand < 0.6) celebration = "✨💫⭐";
                else celebration = "🎆🎇✨";

                return message.reply(
                        celebration + "\n" +
                        getLang("result", winner) + "\n" +
                        celebration + "\n\n💰 +" + reward + " coins!"
                );
        }
};
