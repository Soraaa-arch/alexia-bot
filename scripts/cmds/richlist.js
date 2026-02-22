const fs = require("fs-extra");
const path = require("path");

module.exports = {
        config: {
                name: "richlist",
                aliases: ["rich", "wealth", "toprich"],
                version: "1.0",
                author: "Replit Agent",
                countDown: 3,
                role: 0,
                description: {
                        en: "Global richlist - shows wealthiest players across all groups"
                },
                category: "economy",
                guide: {
                        en: "   {pn} - View top 10 richest players globally"
                }
        },

        langs: {
                en: {
                        richlist: "💎 GLOBAL RICHLIST (TOP 50) 💎\n\n%1",
                        rank: "#%1 | %2 | 💵 %3 coins",
                        empty: "No players yet!"
                }
        },

        onStart: async function ({ message, getLang, usersData }) {
                try {
                        // Get all users from database
                        const allUsersData = await usersData.getAll();
                        
                        const players = [];
                        
                        for (const [userID, userData] of Object.entries(allUsersData)) {
                                const economyData = userData?.data?.economy;
                                if (economyData) {
                                        const total = (economyData.wallet || 0) + (economyData.bank || 0);
                                        if (total > 0) {
                                                players.push({
                                                        id: userID,
                                                        name: userData.name || "Unknown",
                                                        total: total
                                                });
                                        }
                                }
                        }
                        
                        // Sort by total coins
                        players.sort((a, b) => b.total - a.total);
                        
                        // Get top 50
                        const topPlayers = players.slice(0, 50);
                        
                        if (topPlayers.length === 0) {
                                return message.reply(getLang("empty"));
                        }
                        
                        let richlistText = "";
                        topPlayers.forEach((player, idx) => {
                                richlistText += getLang("rank", idx + 1, player.name, player.total) + "\n";
                        });
                        
                        return message.reply(getLang("richlist", richlistText));
                } catch (error) {
                        console.error("Richlist error:", error);
                        return message.reply("❌ Error loading richlist!");
                }
        }
};
