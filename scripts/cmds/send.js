module.exports = {
	config: {
		name: "send",
		aliases: ["give", "transfer", "pay"],
		version: "1.0",
		author: "Replit Agent",
		countDown: 3,
		role: 0,
		description: {
			en: "Send coins to another user"
		},
		category: "economy",
		guide: {
			en: "   {pn} <@user> <amount> - Send coins to someone"
		}
	},

	langs: {
		en: {
			sent: "✅ Sent %1 coins to %2!\n\n👛 Your balance: %3 coins",
			received: "🎁 You received %1 coins from %2!\n\n👛 Your balance: %3 coins",
			insufficientCoins: "❌ You don't have enough coins!",
			invalidAmount: "❌ Invalid amount!",
			noUser: "❌ Please tag a user or provide their ID!"
		}
	},

	onStart: async function ({ message, args, event, usersData, getLang }) {
		const senderID = event.senderID;
		
		// Get target user
		const targetID = event.mentions?.[Object.keys(event.mentions)[0]] || args[0];
		if (!targetID) return message.reply(getLang("noUser"));

		const amount = parseInt(args[event.mentions ? 0 : 1]);
		if (!amount || amount <= 0) return message.reply(getLang("invalidAmount"));

		// Get sender data
		let senderData = await usersData.get(senderID, "data.economy");
		if (!senderData) {
			senderData = { wallet: 0, bank: 0 };
			await usersData.set(senderID, senderData, "data.economy");
		}

		if (senderData.wallet < amount) return message.reply(getLang("insufficientCoins"));

		// Get receiver data
		let receiverData = await usersData.get(targetID, "data.economy");
		if (!receiverData) {
			receiverData = { wallet: 0, bank: 0 };
		}

		// Transfer coins
		senderData.wallet -= amount;
		receiverData.wallet = (receiverData.wallet || 0) + amount;

		await usersData.set(senderID, senderData, "data.economy");
		await usersData.set(targetID, receiverData, "data.economy");

		const targetName = event.mentions?.[Object.keys(event.mentions)[0]]?.name || "User";
		message.reply(getLang("sent", amount, targetName, senderData.wallet));
	}
};
