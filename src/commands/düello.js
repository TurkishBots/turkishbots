const { SlashCommandBuilder } = require("@discordjs/builders");
const { stripIndents } = require("common-tags");
const { randomRange, verify } = require("../util/Util.js");

const gameConfig = {
	hp: 500,
	cheat: false,
	damage: {
		shield: 60,
		max: 100,
		critical: 50,
		min: 10,
	},
	ultraDamage: {
		shield: 150,
		max: 250,
		min: 100,
	},
	bandage: {
		max: 75,
		min: 20,
	},
	choices: ["saldır", "savun", "omnitrix", "bandaj", "kaç"],
};

module.exports = {
	conf: {
		aliases: ["1vs1", "1v1", "savaş", "vs", "pvp"],
		permLevel: 0,
		category: "Eğlence",
		guildOnly: true,
	},

	help: {
		name: "düello",
		description: "İstediğiniz bir kişi ile düello atarsınız!",
		usage: "düello <@kullanıcı>",
	},

	slashCommand: () => new SlashCommandBuilder().addUserOption(option => option.setDescription("Düelloya davet ediceğiniz kullanıcı").setName("rakip").setRequired(true)),

	async execute({ client, message, args, emojis, unicode, isOwner, isSlash }) {
		const { config } = client;
		args = isSlash ? args.map(arg => arg.value) : args;
		const author = isSlash ? message.user : message.author;
		this.fighting = new Set();

		const opponent = isSlash ? message.guild.members.cache.get(args[0])?.user : message.mentions.users.first();
		if (!opponent) return message.reply({ content: `${emojis.error} ${unicode.bullet} Kendi başına savaşmayı mı düşünüyorsun?`, ephemeral: true });

		if (opponent.id === client.user.id) return message.reply({ content: `${emojis.error} ${unicode.bullet} Bu nicke sahip adam seni yer`, ephemeral: true });
		// if (opponent.bot) return message.reply(`${emojis.error} ${unicode.bullet} Bot musunda botlarla savaşıyorsun?`);
		if (opponent.bot && isSlash) message.reply({ content: `${emojis.success} ${unicode.bullet} Başlatılıyor..`, ephemeral: true });
		if (opponent.id === author.id) return message.reply({ content: `${emojis.error} ${unicode.bullet} Kendinle savaşmayı mı düşünüyorsun?`, ephemeral: true });
		if (this.fighting.has(message.channel.id)) return message.reply({ content: `${emojis.error} ${unicode.bullet} Bu kanalda zaten bitmemiş bir oyun var!`, ephemeral: true });
		this.fighting.add(message.channel.id);
		try {
			if (!opponent.bot) {
				await message.reply(`${opponent}, ${author} seni bir düelloya çağrıyor, kabul ediyor musun? (\`evet\` veya \`hayır\`)${config.owners === [author.id, opponent.id] || config.owners === [opponent.id, author.id] ? " (iki admin vs :D)" : ""}`);
				const verification = await verify(message.channel, opponent);
				if (!verification) {
					this.fighting.delete(message.channel.id);
					return message[isSlash ? "followUp" : "reply"](`${author} malesef, ${opponent} düelloyu kabul etmedi.`);
				}
			}
			let userHP = gameConfig.hp;
			let oppoHP = gameConfig.hp;
			let userTurn = false;
			let guard = false;
			const reset = (changeGuard = true) => {
				userTurn = !userTurn;
				guard = !changeGuard;
			};
			const dealDamage = damage => {
				if (userTurn) oppoHP -= damage;
				else userHP -= damage;
			};
			const forfeit = () => {
				if (userTurn) userHP = 0;
				else oppoHP = 0;
			};
			const parseHeart = heart => {
				if (heart <= 0) return ":broken_heart:";
				else if (heart <= gameConfig.hp / 2) return ":mending_heart:";
				else if (heart < gameConfig.hp) return ":heartpulse:";
				return ":sparkling_heart:";
			};
			while (userHP > 0 && oppoHP > 0) {
				const user = userTurn ? author : opponent;
				let choice;
				if (!opponent.bot || (opponent.bot && userTurn)) {
					const msg = await message.channel.send(stripIndents`
							${user} adamım sıra sende, ne yapmak istersin? \`${gameConfig.choices.slice(0, -1).join("`, `")}\` veya korkaksan \`kaç\`?
							**${author.username}**: ${userHP} ${parseHeart(userHP)}
							**${opponent.username}**: ${oppoHP} ${parseHeart(oppoHP)}
						`);
					const filter = res => res.author.id === user.id && gameConfig.choices.includes(res.content.toLowerCase());
					let err = false;
					const turn = await message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ["time"] }).catch(() => (err = true));
					if (err) {
						await msg.reply(`Malesef, ${user} süren **doldu**.`);
						reset();
						continue;
					}
					choice = turn.first().content.toLowerCase();
				} else choice = gameConfig.choices[Math.floor(Math.random() * gameConfig.choices.length - 1)];
				if (choice === "saldır") {
					const missCritical = Math.floor(Math.random() * 4);
					let damage = Math.floor(Math.random() * ((guard ? gameConfig.damage.shield : gameConfig.damage.max) - (!missCritical ? gameConfig.damage.critical : gameConfig.damage.min))) + (!missCritical ? gameConfig.damage.critical : gameConfig.damage.min);
					if (gameConfig.cheat && isOwner) damage = userTurn ? damage + 100 : damage - 100;
					await message.channel.send((damage < 20 ? `${user} aga, vur diyorum vur! salla az şu kırbacı, **${damage}** hasar ne?` : damage > 70 ? `${user}, bir koymuş varyaaa! **${damage}** hasar!` : `${user}, **${damage}** hasar verdi!`) + (!missCritical ? ` **(Kritik!)**` : ""));
					dealDamage(damage);
					reset();
				} else if (choice === "savun") {
					await message.channel.send(`${user}, kendisini süper kalkanıyla savundu!`);
					guard = true;
					reset(false);
				} else if (choice === "omnitrix") {
					let miss = Math.floor(Math.random() * 3);
					if (gameConfig.cheat && isOwner) miss = false;
					if (!miss) {
						let damage = randomRange(gameConfig.ultraDamage.min, guard ? gameConfig.ultraDamage.shield : gameConfig.ultraDamage.max);
						if (gameConfig.cheat && isOwner) damage = userTurn ? damage + 100 : damage - 100;
						await message.channel.send(`${user}, 4 kola dönüşmeyi başardı ve **${damage}** hasar vurdu!${damage === gameConfig.damage.max ? " (VURDU KIRBACI)" : damage > 225 ? " (sağlam geçirdi)" : ""}`);
						dealDamage(damage);
					} else await message.channel.send(`${user}, 4 kola dönüşürken Omnitrix **hata** verdi! Belki bir dahakine Elmas Kafa'ya dönüşür ha?`);
					reset();
				} else if (choice === "bandaj") {
					if (!opponent.bot && (userTurn ? userHP : oppoHP) === gameConfig.hp) {
						message.channel.send("Canın zaten full!");
						continue;
					}
					const haveBandage = !Math.floor(Math.random() * 2);
					if (haveBandage) {
						const currentHP = userTurn ? userHP : oppoHP;
						const heal = randomRange(gameConfig.bandage.min, gameConfig.bandage.max);
						userTurn ? (userHP += heal) : (oppoHP += heal);
						if ((userTurn ? userHP : oppoHP) > gameConfig.hp) userTurn ? (userHP = gameConfig.hp) : (oppoHP = gameConfig.hp);
						await message.channel.send(`${user}, Süper bandajını kullanarak kendini **${Math.floor(100 - ((currentHP / (currentHP + heal)) * 100).toFixed(2))}% (${heal})** iyileştirdi!`);
					} else await message.channel.send(`${user}, Süper bandajı kullanırken yere **düşürdü**!`);
					reset();
				} else if (choice === "kaç") {
					await message.channel.send(`Ahahaha, ${user} kaçarak **korkaklığını** belli etti!`);
					forfeit();
					break;
				} else await message[isSlash ? "followUp" : "reply"]("Nasıl yani? hmm? anlamadım ama?");
			}
			this.fighting.delete(message.channel.id);
			const winner = userHP > oppoHP ? author : opponent;
			return message.channel.send(`Oyun bitti! Helal olsun, **${winner}**\n**${author.username}**: ${userHP} ${parseHeart(userHP)} \n**${opponent.username}**: ${oppoHP} ${parseHeart(oppoHP)}`);
		} catch (err) {
			this.fighting.delete(message.channel.id);
			message[isSlash ? "followUp" : "reply"](`${emojis.error} Bir hata oluştu!\n\`\`\`js\n${err.toString()}\`\`\``);
			throw err;
		}
	},
};
