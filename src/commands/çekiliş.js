// const { SlashCommandBuilder } = require("@discordjs/builders");
const ms = require("ms");

module.exports = {
	conf: {
		aliases: ["çekiliş-yap", "çekilişyap"],
		permLevel: "MANAGE_GUILD",
		category: "Moderasyon",
		guildOnly: true,
	},

	help: {
		name: "çekiliş",
		description: "Sunucuda çekiliş yaparsınız.",
		usage: "çekiliş <zaman|reroll|delete|end> <adet|mesaj_id> <ödül>",
	},

	// slashCommand: () => new SlashCommandBuilder(),

	execute({ client, message, args, emojis, unicode, isSlash }) {
		try {
			if (args[0] === "reroll") {
				const msgId = message?.reference?.messageId ?? args[1];
				if (!msgId) return message.reply(`${emojis.error} ${unicode.bullet} Lütfen reroll yapılacak mesajın ID'sini yazın.`);
				client.giveawaysManager.reroll(msgId, { messages: client.giveawaysManager.messages.reroll }).catch(err => {
					if (err === `No giveaway found with message Id ${msgId}.`) return message.reply(`${emojis.error} ${unicode.bullet} Bu mesajla ilgili bir çekiliş bulunamadı.`);
					throw err;
				});
			} else if (args[0] === "delete") {
				const msgId = message?.reference?.messageId ?? args[1];
				if (!msgId) return message.reply(`${emojis.error} ${unicode.bullet} Lütfen silinecek mesajın ID'sini yazın.`);
				client.giveawaysManager
					.delete(msgId)
					.then(giveway => message.reply(`${emojis.success} ${unicode.bullet} \`${giveway.prize}\` Çekilişi başarıyla silindi.`).then(m => setTimeout(() => m.delete(), 5000)))
					.catch(err => {
						if (err === `No giveaway found with message Id ${msgId}.`) return message.reply(`${emojis.error} ${unicode.bullet} Bu mesajla ilgili bir çekiliş bulunamadı.`);
						throw err;
					});
			} else if (args[0] === "end") {
				const msgId = message?.reference?.messageId ?? args[1];
				if (!msgId) return message.reply(`${emojis.error} ${unicode.bullet} Lütfen bitirilecek mesajın ID'sini yazın.`);
				client.giveawaysManager.end(msgId).catch(err => {
					if (err === `No giveaway found with message Id ${msgId}.`) return message.reply(`${emojis.error} ${unicode.bullet} Bu mesajla ilgili bir çekiliş bulunamadı.`);
					throw err;
				});
			} else {
				const duration = args[0] ? ms(args[0]) : null;
				const winnerCount = parseInt(args[1]);
				const prize = args.slice(2).join(" ").trim();
				if (!duration) return message.reply(`${emojis.error} ${unicode.bullet} Lütfen bir zaman belirtin.`);
				if (!winnerCount) return message.reply(`${emojis.error} ${unicode.bullet} Lütfen bir adet belirtin.`);
				if (!prize) return message.reply(`${emojis.error} ${unicode.bullet} Lütfen bir ödül belirtin.`);
				client.giveawaysManager.start(message.channel, { duration, winnerCount, prize, messages: client.giveawaysManager.messages.raw }).catch(console.error);
			}
		} catch (err) {
			message.reply(`${emojis.error} ${unicode.bullet} Bir hata oluştu!\n\`\`\`js\n${err}\`\`\``);
			console.error(err);
		}
	},
};
