module.exports = {
	config: {
		name: "deckbuild",
		aliases: ["build", "deckhelp", "deckguide"],
		version: "1.0",
		author: "Replit Agent",
		countDown: 5,
		role: 0,
		description: {
			en: "Get deck building recommendations and strategies"
		},
		category: "yugioh",
		guide: {
			en: "   {pn} <archetype> - Get building guide\n   {pn} list - View all archetypes\n   {pn} tips - Deck building tips"
		}
	},

	langs: {
		en: {
			guide: "🎴 DECK BUILDING GUIDE - %1 🎴\n\n━━━━━━━━━━━━━━━━━━━━━\n📊 Deck Type: %2\n🎯 Strategy: %3\n\n🔑 CORE CARDS (%4):\n%5\n\n⚙️ ENGINE CARDS:\n%6\n\n🛡️ HAND TRAPS (Recommended):\n%7\n\n💡 BUILDING TIPS:\n%8\n━━━━━━━━━━━━━━━━━━━━━",
			tips: "💡 DECK BUILDING TIPS 💡\n\n━━━━━━━━━━━━━━━━━━━━━\n1️⃣ **40-CARD RULE**: Always aim for 40 cards max\n2️⃣ **CONSISTENCY**: 3x core cards, 2-3x support\n3️⃣ **RATIOS**: Follow 10-20-10 (core/support/generic)\n4️⃣ **HAND TRAPS**: Include 8-12 hand traps\n5️⃣ **SPELL/TRAP**: 30% of deck minimum\n6️⃣ **DRAW POWER**: Include Pot of Prosperity/Desires\n7️⃣ **NEGATES**: 3+ board negates minimum\n8️⃣ **TESTING**: Always playtest before tournament\n\n🎯 BANNED CARDS: Check latest ban list!",
			list: "📚 AVAILABLE ARCHETYPES 📚\n\n%1"
		}
	},

	guides: {
		"swordsoul": {
			type: "Synchro-Control Hybrid",
			strategy: "Synchro Summon powerful monsters for board control with hand traps to disrupt opponent. Focus on establishing endboard with multiple negates.",
			coreCards: ["Swordsoul Strategist Longyuan (3)", "Swordsoul Supremacy (3)", "Visas Starfrost (3)", "Swordsoul Singularity (2)"],
			engineCards: ["Adventurer Token", "Water Enchantress", "Maxx C (2-3)", "Ash Blossom & Joyous Spring (2)"],
			handTraps: ["Maxx C", "Ash Blossom", "Ghost Ogre", "Effect Veiler"],
			tips: "Focus on searching Swordsoul cards early. Use Longyuan to establish synchro plays. Keep hand traps for opponent's turn. Avoid overextending your resources."
		},
		"tearlaments": {
			type: "Fusion-Milling Combo",
			strategy: "Mill cards to trigger Tearlament effects. Build powerful Fusion monsters for boss plays. Use mills as advantage generators.",
			coreCards: ["Tearlaments Scheiren (3)", "Tearlaments Kitkallos (3)", "Tearlaments Merrli (2)", "Primeval Planet Prajna (3)"],
			engineCards: ["Neptabyss the Atlantean (2)", "Abyss Actor Cards (2)", "Pot of Prosperity (2)", "Tour Guide From the Underworld"],
			handTraps: ["Maxx C", "Lancea", "Ghost Ogre", "Artifact Lancea"],
			tips: "Mill consistently to trigger Tearlament effects. Build your graveyard as a resource. Fusion Summon for strong boards. Control deck pacing."
		},
		"unchained": {
			type: "Synchro-Control",
			strategy: "Use Unchained monsters for disruption and board control. Synchro Summon for negates. Maintain board presence throughout the duel.",
			coreCards: ["Unchained Soul of Anguish (3)", "Unchained Abomination (3)", "Abominable Unchained Soul (2)", "Unchained Twins (2)"],
			engineCards: ["Dark Ruler No More (2)", "Lightning Storm (2)", "Crossout Designator (2)", "Infinite Impermanence (2)"],
			handTraps: ["Ghost Ogre", "Ash Blossom", "Red Reboot", "Droll & Lock Bird"],
			tips: "Use Unchained effects for disruption. Synchro Summon strategically. Maintain card advantage. Control opponent's plays with hand traps."
		},
		"spright": {
			type: "Xyz-Link Combo",
			strategy: "Quick Xyz Summons for fast plays. Use Spright effects to search and swarm. Build explosive turns with multiple Synchro/Xyz summoning.",
			coreCards: ["Spright Sprout (3)", "Spright Red (3)", "Spright Blue (2)", "Spright Carrot (2)"],
			engineCards: ["Spright Jet (2)", "Spright Smash (2)", "Maxx C (2)", "Pot of Desires (2)"],
			handTraps: ["Ash Blossom", "Ghost Ogre", "Veiler", "Crossout Designator"],
			tips: "Focus on Xyz summoning for quick plays. Use Sprout searches efficiently. Synchro plays for extra turns. Maintain tempo advantage."
		}
	},

	onStart: async function ({ message, args, getLang, event, usersData }) {
		const archetype = args[0]?.toLowerCase();

		if (args[0]?.toLowerCase() === "tips") {
			return message.reply(getLang("tips"));
		}

		if (args[0]?.toLowerCase() === "list") {
			const list = Object.keys(this.guides)
				.map(arch => `• ${arch.charAt(0).toUpperCase() + arch.slice(1)}`)
				.join("\n");
			return message.reply(getLang("list", list));
		}

		const guide = this.guides[archetype];
		if (archetype && guide) {
			return message.reply(getLang("guide",
				archetype.charAt(0).toUpperCase() + archetype.slice(1),
				guide.type,
				guide.strategy,
				guide.coreCards.length,
				guide.coreCards.join("\n"),
				guide.engineCards.join("\n"),
				guide.handTraps.join("\n"),
				guide.tips
			));
		}

		return message.reply("❌ Archetype not found! Type `*deckbuild list` to see available archetypes.");
	}
};
