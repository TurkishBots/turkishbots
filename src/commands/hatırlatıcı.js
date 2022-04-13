const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const ms = require("ms");

const formatTime = time => time.replaceAll("saniye", "second").replaceAll("dakika", "minute").replaceAll("saat", "hour").replaceAll("gün", "day").replaceAll("hafta", "week").replaceAll("yıl", "year");

module.exports = {
	conf: {
		aliases: [],
		permLevel: 0,
		category: "Genel",
	},

	help: {
		name: "hatırlatıcı",
		description: "Belirttiğiniz zaman içerisinde size belirttiğiniz mesajı yollar.",
		usage: "hatırlatıcı <zaman> <mesaj>",
	},

	slashCommand: () => new SlashCommandBuilder().addStringOption(option => option.setName("zaman").setDescription("Hatırlatılıcak zaman").setRequired(true)).addStringOption(option => option.setName("mesaj").setDescription("Hatırlatılıcak mesaj").setRequired(true)),

	execute({ client, message, args, emojis, unicode, isSlash }) {
		const author = isSlash ? message.user : message.author;
		const time = isSlash ? args[0]?.value?.trim?.() : args[0]?.trim?.()?.replaceAll?.("_", " ");
		const msg = isSlash ? args[1]?.value?.trim?.() : args.slice(1).join(" ").trim();
		if (!time) return message.reply(`${emojis.error} ${unicode.bullet} Lütfen bir zaman belirtin`);
		if (!msg) return message.reply(`${emojis.error} ${unicode.bullet} Lütfen bir mesaj belirtin`);
		if (msg.length > 2000) return message.reply({ content: `${emojis.error} ${unicode.bullet} Mesaj çok uzun`, ephemeral: true });
		if (!ms(formatTime(time))) return message.reply({ content: `${emojis.error} ${unicode.bullet} Lütfen geçerli bir zaman belirtin`, ephemeral: true });

		message.reply({ content: `${emojis.success} ${unicode.bullet} Hatırlatıcı başarıyla oluşturuldu!`, ephemeral: true });
		const embed = new MessageEmbed()
			.setAuthor({ name: author.username, iconURL: author.avatarURL() })
			.setDescription(msg)
			.setColor("RANDOM")
			.setTimestamp()
			.setFooter({ text: `${client.user.username} - Hatırlatıcı Sistemi`, iconURL: client.user.avatarURL() })
			.setURL(`https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`)
			.setTitle("Hatırlatıcı");
		setTimeout(() => author.send({ embeds: [embed] }).catch(() => {}), ms(formatTime(time)));
	},
};
