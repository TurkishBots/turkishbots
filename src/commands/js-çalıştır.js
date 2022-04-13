const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
	conf: {
		aliases: ["jskodçalıştır", "javascriptçalıştır", "jsçalıştır"],
		permLevel: "GAMER",
		category: "Admin",
	},

	help: {
		name: "js-çalıştır",
		description: "Botta bir JavaScript kodu çalıştırır.",
		usage: "js-çalıştır <js-kodu>",
	},

	slashCommand: () => new SlashCommandBuilder().addStringOption(option => option.setName("kod").setDescription("Çalıştırılıcak JavaScript kodu").setRequired(true)),

	execute({ client, message, args, emojis, unicode, isSlash }) {
		const author = isSlash ? message.user : message.author;
		args[0] = isSlash ? args[0]?.value?.trim?.() : args[0]?.trim?.();
		if (!args[0]) return message.reply({ content: `${emojis.error} ${unicode.bullet} Lütfen çalıştırmak istediğiniz kodu girin!`, ephemeral: true });

		const code = args
			.join(" ")
			.replaceAll(/```(js)?/gim, "")
			.trim();

		message.channel.sendTyping();

		let result;
		try {
			result = eval(code.replaceAll("client.token", "BOT_TOKEN")); // eslint-disable-line no-eval
			if (typeof result !== "string") result = require("util").inspect(result);
		} catch (err) {
			result = err;
		}
		result = result.toString().replaceAll(client.token, "BOT_TOKEN");
		try {
			const embed = new MessageEmbed();
			embed.setColor("RANDOM");
			embed.setAuthor({ name: author.username, iconURL: author.avatarURL() });
			embed.addField("Kod", code.length < 1024 ? `\`\`\`js\n${code}\`\`\`` : "Kod çok uzun!");
			embed.addField("Sonuç", result.length < 1024 ? `\`\`\`js\n${result}\`\`\`` : "Sonuç çok uzun!");
			embed.setTimestamp();
			embed.setFooter({ text: `${client.user.username} Kod Sistemi`, iconURL: client.user.avatarURL() });
			message.reply({ embeds: [embed], ephemeral: true }).catch(err => message.reply({ content: `${emojis.error} ${unicode.bullet} Discord API hatası!\n\`\`\`js\n${err.toString()}\`\`\``, ephemeral: true }));
		} catch (err) {
			message.reply({ content: `${emojis.error} ${unicode.bullet} Bir hata oluştu\n\`\`\`js\n${err.toString()}\`\`\``, ephemeral: true });
		}
	},
};
