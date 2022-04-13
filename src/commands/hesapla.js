const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const math = require("math-expression-evaluator");

module.exports = {
	conf: {
		aliases: ["hesapmakinesi", "hesapyap", "hesap-makinesi", "hesap-yap"],
		permLevel: 0,
		category: "Genel",
	},

	help: {
		name: "hesapla",
		description: "Belirttiğiniz matematik işlemlerini yapar.",
		usage: "hesapla <işlem>",
	},

	slashCommand: () => new SlashCommandBuilder().addStringOption(option => option.setDescription("Hesaplanacak işlem").setName("islem").setRequired(true)),

	execute({ client, message, args, emojis, unicode, isSlash }) {
		const author = isSlash ? message.user : message.author;
		args[0] = isSlash ? args[0]?.value : args[0];
		if (!args[0]) return message.reply({ content: `${emojis.error} ${unicode.bullet} Lütfen bir işlem giriniz.\n**Kullanım**\n${client.config.prefix}hesapla <işlem>`, ephemeral: true });
		const question = args.join(" ");
		let answer;
		try {
			answer = math.eval(question);
		} catch (err) {
			return message.reply({ content: `${emojis.error} ${unicode.bullet} Hatalı işlem **${err.message}**`, ephemeral: true });
		}

		const embed = new MessageEmbed();
		embed.addField("İşlem", `\`\`\`js\n${question.toString()}\`\`\``);
		embed.addField("Sonuç", `\`\`\`js\n${answer.toString() === "31" ? "31 sj" : answer.toString()}\`\`\``);
		embed.setTimestamp();
		embed.setColor("RANDOM");
		if (!isSlash) embed.setFooter({ text: `${author.tag} Tarafından kullanıldı`, iconURL: author.avatarURL() });
		message.reply({ embeds: [embed], ephemeral: true });
	},
};
