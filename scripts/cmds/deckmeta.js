module.exports = {
	config: {
		name: "deckmeta",
		aliases: ["meta", "competitive"],
		version: "1.0",
		author: "Replit Agent",
		countDown: 5,
		role: 0,
		description: {
			en: "View current Yu-Gi-Oh meta decks and tier rankings"
		},
		category: "yugioh",
		guide: {
			en: "   {pn} - View current meta\n   {pn} <deck> - Get deck details\n   {pn} tier1 - See Tier 1 decks only"
		}
	},

	langs: {
		en: {
			meta: "🏆 YU-GI-OH META REPORT 🏆\n\n━━━━━━━━━━━━━━━━━━━━━\n📊 TIER 1 (Dominating):\n%1\n\n📊 TIER 2 (Competitive):\n%2\n\n📊 TIER 3 (Emerging):\n%3\n━━━━━━━━━━━━━━━━━━━━━",
			detail: "🎴 %1 DECK 🎴\n\n━━━━━━━━━━━━━━━━━━━━━\n📊 Tier: %2\n🎯 Winrate: %3%%\n📈 Popularity: %4%%\n\n🔑 Key Cards:\n%5\n\n💡 Strategy:\n%6\n━━━━━━━━━━━━━━━━━━━━━",
			tier1: "🥇 TIER 1 DECKS 🥇\n\n%1"
		}
	},

	metaDecks: {
		"Swordsoul": {
			tier: "TIER 1 - Dominating",
			winrate: 52,
			popularity: 18,
			keyCards: ["Swordsoul Strategist Longyuan", "Swordsoul Strategist Longyuan", "Swordsoul Supremacy", "Visas Starfrost"],
			strategy: "Synchro-heavy strategy with hand traps for control. Uses Swordsoul cards to build powerful boards."
		},
		"Tearlaments": {
			tier: "TIER 1 - Dominating",
			winrate: 51,
			popularity: 16,
			keyCards: ["Tearlaments Scheiren", "Tearlaments Kitkallos", "Tearlaments Merrli", "Primeval Planet Prajna"],
			strategy: "Fusion-based deck using Tearlament effects to mill and set up powerful combo turns with strong plays."
		},
		"Unchained": {
			tier: "TIER 1 - Dominating",
			winrate: 50,
			popularity: 15,
			keyCards: ["Unchained Soul of Anguish", "Abominable Unchained Soul", "Unchained Abomination", "Unchained Twins Chixiao and Longyuan"],
			strategy: "Control-focused with Synchro summoning for defensive plays and hand disruption throughout the duel."
		},
		"Spright": {
			tier: "TIER 2 - Competitive",
			winrate: 48,
			popularity: 12,
			keyCards: ["Spright Sprout", "Spright Red", "Spright Blue", "Spright Carrot"],
			strategy: "Xyz/Link hybrid deck with quick synergies for fast combo plays and board setup."
		},
		"Adventurer": {
			tier: "TIER 2 - Competitive",
			winrate: 47,
			popularity: 14,
			keyCards: ["Adventurer Token", "Adventurer's Sword Fistsoul", "Fateful Adventure", "Water Enchantress of the Temple"],
			strategy: "Multi-archetype engine that provides consistency and card advantage across most deck builds."
		},
		"Branded": {
			tier: "TIER 2 - Competitive",
			winrate: 46,
			popularity: 11,
			keyCards: ["Branded Despia Eria", "Branded in Red", "Branded Opening", "Unchained Abomination"],
			strategy: "Fusion-based control using Branded cards for consistent board setups with strong endboards."
		},
		"Drytron": {
			tier: "TIER 3 - Emerging",
			winrate: 44,
			popularity: 8,
			keyCards: ["Drytron Alpha Thuban", "Drytron Zeta Aldhibah", "Drytron Interceptor Fujin", "Meteonis Drytron Descent"],
			strategy: "Synchro/Ritual hybrid using Drytron cards for floodgate effects and deck consistency."
		},
		"Mirrorjade": {
			tier: "TIER 3 - Emerging",
			winrate: 43,
			popularity: 7,
			keyCards: ["Mirrorjade the Iceblade Dragon", "Despia Branded Fusion", "Despia Tragedy", "Virtual World City"],
			strategy: "Fusion control deck with strong disruption and recovery mechanics for late game plays."
		}
	},

	onStart: async function ({ message, args, getLang, event, usersData }) {
		const deckName = args[0]?.toLowerCase();

		if (args[0]?.toLowerCase() === "tier1") {
			const tier1Decks = Object.entries(this.metaDecks)
				.filter(([_, deck]) => deck.tier.includes("TIER 1"))
				.map(([name, deck]) => `🥇 ${name} - ${deck.winrate}% WR, ${deck.popularity}% meta`)
				.join("\n");
			
			return message.reply(getLang("tier1", tier1Decks));
		}

		if (deckName && this.metaDecks[Object.keys(this.metaDecks).find(k => k.toLowerCase() === deckName)]) {
			const deck = this.metaDecks[Object.keys(this.metaDecks).find(k => k.toLowerCase() === deckName)];
			return message.reply(getLang("detail", 
				Object.keys(this.metaDecks).find(k => k.toLowerCase() === deckName),
				deck.tier,
				deck.winrate,
				deck.popularity,
				deck.keyCards.join("\n• "),
				deck.strategy
			));
		}

		const tier1 = Object.entries(this.metaDecks)
			.filter(([_, d]) => d.tier.includes("TIER 1"))
			.map(([name, d]) => `🥇 ${name} - ${d.winrate}% WR`)
			.join("\n");
		
		const tier2 = Object.entries(this.metaDecks)
			.filter(([_, d]) => d.tier.includes("TIER 2"))
			.map(([name, d]) => `🥈 ${name} - ${d.winrate}% WR`)
			.join("\n");
		
		const tier3 = Object.entries(this.metaDecks)
			.filter(([_, d]) => d.tier.includes("TIER 3"))
			.map(([name, d]) => `🥉 ${name} - ${d.winrate}% WR`)
			.join("\n");

		return message.reply(getLang("meta", tier1, tier2, tier3));
	}
};
