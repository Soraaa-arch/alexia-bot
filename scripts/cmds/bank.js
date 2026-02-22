module.exports = {
	config: {
		name: "bank",
		aliases: ["savings"],
		version: "1.0",
		author: "Replit Agent",
		countDown: 3,
		role: 0,
		description: {
			en: "Bank operations - check balance, deposit, withdraw"
		},
		category: "economy",
		guide: {
			en: "   {pn} - Check bank balance\n   {pn} deposit <amount> - Deposit to bank\n   {pn} withdraw <amount> - Withdraw from bank"
		}
	},

	langs: {
		en: {
			balance: "🏦 BANK BALANCE\n\n💳 Saved: %1 coins\n👛 Wallet: %2 coins\n💵 Total: %3 coins",
			deposit: "✅ Deposited %1 coins!\n\n👛 Wallet: %2\n🏦 Bank: %3",
			withdraw: "✅ Withdrew %1 coins!\n\n👛 Wallet: %2\n🏦 Bank: %3",
			insufficientWallet: "❌ Not enough coins in wallet!",
			insufficientBank: "❌ Not enough coins in bank!",
			invalidAmount: "❌ Invalid amount!"
		}
	},

	onStart: async function ({ message, args, getLang, event, usersData }) {
		const userID = event.senderID;
		
		let userData = await usersData.get(userID, "data.economy");
		if (!userData) {
			userData = { wallet: 0, bank: 0 };
			await usersData.set(userID, userData, "data.economy");
		}

		const action = args[0]?.toLowerCase();

		if (!action || action === "balance") {
			const wallet = userData.wallet || 0;
			const bank = userData.bank || 0;
			const total = wallet + bank;
			return message.reply(getLang("balance", bank, wallet, total));
		}

		if (action === "deposit") {
			const amount = parseInt(args[1]);
			if (!amount || amount <= 0) return message.reply(getLang("invalidAmount"));
			if (userData.wallet < amount) return message.reply(getLang("insufficientWallet"));

			userData.wallet -= amount;
			userData.bank = (userData.bank || 0) + amount;
			await usersData.set(userID, userData, "data.economy");

			return message.reply(getLang("deposit", amount, userData.wallet, userData.bank));
		}

		if (action === "withdraw") {
			const amount = parseInt(args[1]);
			if (!amount || amount <= 0) return message.reply(getLang("invalidAmount"));
			if ((userData.bank || 0) < amount) return message.reply(getLang("insufficientBank"));

			userData.bank -= amount;
			userData.wallet = (userData.wallet || 0) + amount;
			await usersData.set(userID, userData, "data.economy");

			return message.reply(getLang("withdraw", amount, userData.wallet, userData.bank));
		}

		return message.reply("Unknown action! Use: balance, deposit, or withdraw");
	}
};
