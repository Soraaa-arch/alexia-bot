module.exports = {
        config: {
                name: "bet",
                aliases: ["wager", "gamble"],
                version: "1.0",
                author: "Replit Agent",
                countDown: 5,
                role: 0,
                description: {
                        en: "Bet coins on exciting games! Higher risk = Higher reward"
                },
                category: "economy",
                guide: {
                        en: "   {pn} <amount> - Bet on coin flip\n   {pn} rps <rock|paper|scissors> <amount> - Bet on RPS"
                }
        },

        langs: {
                en: {
                        coinflip_start: "🎰 COIN FLIP BET 🎰\n\n━━━━━━━━━━━━━━━━━━━━━━\n💵 Bet Amount: %1 coins\n💰 If Win: %2 coins\n💸 If Lose: -0 coins\n━━━━━━━━━━━━━━━━━━━━━━\n\n⏳ Flipping...",
                        coinflip_win: "🎉 YOU WON! 🎉\n\n━━━━━━━━━━━━━━━━━━━━━━\n🪙 Result: %1\n💰 Won: %2 coins!\n✨ New Balance: %3\n━━━━━━━━━━━━━━━━━━━━━━",
                        coinflip_lose: "😢 YOU LOST 😢\n\n━━━━━━━━━━━━━━━━━━━━━━\n🪙 Result: %1\n💸 Lost: %2 coins\n😞 New Balance: %3\n━━━━━━━━━━━━━━━━━━━━━━",
                        rps_start: "🎮 RPS BET 🎮\n\n━━━━━━━━━━━━━━━━━━━━━━\n💵 Bet: %1 coins\n🎯 Your Choice: %2\n💰 If Win: %3 coins\n━━━━━━━━━━━━━━━━━━━━━━\n\n⏳ Bot choosing...",
                        rps_win: "🎉 YOU WON! 🎉\n\n━━━━━━━━━━━━━━━━━━━━━━\n🤖 Bot chose: %1\n👤 You chose: %2\n💰 Won: %3 coins!\n✨ New Balance: %4\n━━━━━━━━━━━━━━━━━━━━━━",
                        rps_lose: "😢 YOU LOST 😢\n\n━━━━━━━━━━━━━━━━━━━━━━\n🤖 Bot chose: %1\n👤 You chose: %2\n💸 Lost: %3 coins\n😞 New Balance: %4\n━━━━━━━━━━━━━━━━━━━━━━",
                        rps_tie: "🤝 IT'S A TIE! 🤝\n\n━━━━━━━━━━━━━━━━━━━━━━\n🤖 Bot chose: %1\n👤 You chose: %1\n💰 Your coins back: %2\n✨ Balance: %3\n━━━━━━━━━━━━━━━━━━━━━━",
                        insufficient: "❌ Not enough coins!\n\n💵 You have: %1 coins\n💸 Need: %2 coins",
                        invalid_amount: "❌ Invalid bet amount!",
                        invalid_choice: "❌ Invalid choice! Use: rock, paper, scissors"
                }
        },

        onStart: async function ({ message, args, getLang, event, usersData }) {
                const userID = event.senderID;
                
                let userData = await usersData.get(userID, "data.economy");
                if (!userData) userData = { wallet: 0, bank: 0 };

                const gameType = args[0]?.toLowerCase() || "coinflip";
                let amount = 0;
                let choice = null;

                if (gameType === "rps") {
                        choice = args[1]?.toLowerCase();
                        amount = parseInt(args[2]);
                } else {
                        amount = parseInt(args[0]);
                }

                if (!amount || amount <= 0) return message.reply(getLang("invalid_amount"));
                if (userData.wallet < amount) return message.reply(getLang("insufficient", userData.wallet, amount));

                // COIN FLIP
                if (gameType !== "rps") {
                        await message.reply(getLang("coinflip_start", amount, amount * 2));
                        await new Promise(r => setTimeout(r, 2000));

                        const won = Math.random() < 0.5;
                        const result = won ? "Heads" : "Tails";

                        userData.wallet -= amount;
                        userData.level = userData.level || 1;
                        userData.exp = userData.exp || 0;
                        
                        if (won) {
                                userData.wallet += amount * 2;
                                userData.exp += 15;
                        } else {
                                userData.exp += 5;
                        }
                        
                        const expNeeded = 100 + (userData.level - 1) * 50;
                        if (userData.exp >= expNeeded) {
                                userData.level += 1;
                                userData.exp = 0;
                        }
                        
                        await usersData.set(userID, userData, "data.economy");
                        const levelUp = userData.exp === 0 && won ? "\n\n🎉 **LEVEL UP!** You are now level " + userData.level + "!" : "";
                        
                        if (won) {
                                return message.reply(getLang("coinflip_win", result, amount, userData.wallet) + levelUp);
                        } else {
                                return message.reply(getLang("coinflip_lose", result, amount, userData.wallet));
                        }
                }

                // ROCK PAPER SCISSORS BET
                const choices = ["rock", "paper", "scissors"];
                if (!choices.includes(choice)) return message.reply(getLang("invalid_choice"));

                await message.reply(getLang("rps_start", amount, choice, amount * 2));
                await new Promise(r => setTimeout(r, 1500));

                const botChoice = choices[Math.floor(Math.random() * 3)];
                userData.wallet -= amount;
                userData.level = userData.level || 1;
                userData.exp = userData.exp || 0;

                let won = false;
                if (choice === botChoice) {
                        userData.wallet += amount;
                        userData.exp += 10;
                } else if (
                        (choice === "rock" && botChoice === "scissors") ||
                        (choice === "paper" && botChoice === "rock") ||
                        (choice === "scissors" && botChoice === "paper")
                ) {
                        userData.wallet += amount * 2;
                        userData.exp += 15;
                        won = true;
                } else {
                        userData.exp += 5;
                }
                
                const expNeeded = 100 + (userData.level - 1) * 50;
                if (userData.exp >= expNeeded) {
                        userData.level += 1;
                        userData.exp = 0;
                }

                await usersData.set(userID, userData, "data.economy");

                const levelUp = userData.exp === 0 ? "\n\n🎉 **LEVEL UP!** You are now level " + userData.level + "!" : "";
                if (choice === botChoice) {
                        return message.reply(getLang("rps_tie", choice, amount, userData.wallet) + levelUp);
                } else if (won) {
                        return message.reply(getLang("rps_win", botChoice, choice, amount, userData.wallet) + levelUp);
                } else {
                        return message.reply(getLang("rps_lose", botChoice, choice, amount, userData.wallet));
                }
        }
};
