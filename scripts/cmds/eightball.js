module.exports = {
	config: {
		name: "8ball",
		version: "1.0",
		author: "NeoKEX",
		countDown: 2,
		role: 0,
		description: {
			vi: "Hỏi bóng 8 ma thuật",
			en: "Ask the magic 8 ball"
		},
		category: "games",
		guide: {
			vi: "   {pn} <câu hỏi> - Hỏi bóng 8 ma thuật",
			en: "   {pn} <question> - Ask the magic 8 ball"
		}
	},

	langs: {
		vi: {
			noQuestion: "Hãy hỏi một câu hỏi!",
			asking: "🎱 Bóng 8 ma thuật đang suy nghĩ..."
		},
		en: {
			noQuestion: "Please ask a question!",
			asking: "🎱 The magic 8 ball is thinking..."
		}
	},

	onStart: async function ({ message, args, getLang }) {
		const answers = [
			// Positive
			"Yes, definitely! 😊",
			"It is certain 🌟",
			"Most likely ✨",
			"Signs point to yes 👍",
			"Absolutely! 🎉",
			// Negative
			"Don't count on it 😕",
			"Probably not 😑",
			"My sources say no 🚫",
			"Very doubtful 😬",
			// Maybe
			"Ask again later 🤔",
			"Cannot predict now 🌀",
			"Better not tell you now 🤐",
			"Concentrate and ask again 💭"
		];

		if (!args[0]) {
			return message.reply(getLang("noQuestion"));
		}

		const answer = answers[Math.floor(Math.random() * answers.length)];
		return message.reply(`🎱 *${answer}*`);
	}
};
