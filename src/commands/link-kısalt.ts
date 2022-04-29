import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed, Permissions } from "discord.js";
import { DiscordCommand } from "../types";
import axios from "axios";

const linkKisalt: DiscordCommand = {
	conf: {
		aliases: ["linkkısalt", "url-kısalt", "urlkısalt"],
		permLevel: Permissions.DEFAULT,
		category: "Genel"
	},

	help: {
		name: "link-kısalt",
		description: "Belirttiğiniz uzun linki kısaltır.",
		usage: "link-kısalt <link>"
	},

	slashCommand: () => new SlashCommandBuilder().addStringOption(option => option.setName("link").setDescription("Kısaltılacak link").setRequired(true)),

	async execute({ client, message, args, emojis, unicode, isSlash }) {
		const link = isSlash ? args[0]["value"].trim() : args.join("").trim();
		if (!link) return message.reply(`${emojis.error} ${unicode.bullet} Lütfen bir link girin.`);
		if (!link.match(/^(https?:\/\/)?(.*)\.(.*)$/gi)) return message.reply(`${emojis.error} ${unicode.bullet} Lütfen geçerli bir link girin.`);

		try {
			const req = await axios.get("https://bitly.com/");
			const token = req.headers["set-cookie"][0].split("=")[1].split(";")[0];
			const short: any = await axios
				.post("https://bitly.com/data/anon_shorten", `url=${encodeURI(link)}`, { headers: { cookie: `_xsrf=${token};`, "x-xsrftoken": token, "content-type": "application/x-www-form-urlencoded; charset=UTF-8" } })
				.catch(err => message.reply({ content: `${emojis.error} ${unicode.bullet} İstek atarken bir hata oluştu!\n\`\`\`js\n${err}\`\`\``, ephemeral: true }));
			if (!short?.data) return;
			if (short.data?.status_txt === "INVALID_ARG_URL") return message.reply({ content: `${emojis.error} ${unicode.bullet} Geçersiz link!`, ephemeral: true });
			if (short.data?.status_txt === "ALREADY_A_BITLY_LINK") return message.reply({ content: `${emojis.error} ${unicode.bullet} Bu zaten kısaltılmış bir link!`, ephemeral: true });
			if (short.data?.status_txt === "UNKNOWN_ERROR") return message.reply({ content: `${emojis.error} ${unicode.bullet} Bilinmeyen bir hata oluştu!`, ephemeral: true });
			if (short.data.status_code !== 200) return message.reply({ content: `${emojis.error} ${unicode.bullet} Link kısaltılamadı!`, ephemeral: true });
			const embed = new MessageEmbed()
				.setColor("RANDOM")
				.setAuthor({ name: message.author.username, iconURL: message.author.avatarURL() })
				.setTitle(`Link Kısaltma Sonuçları`)
				.addField("Kısaltılan Link:", `[${short.data.data.long_url}](${short.data.data.long_url})`)
				.addField("Kısaltılmış Link:", `[${short.data.data.link}](${short.data.data.link})`)
				.addField("Kısaltma Servisi", "**Bit.ly**")
				.setFooter({ text: `${client.user.username} - Link Kısaltma Sistemi`, iconURL: client.user.avatarURL() })
				.setTimestamp();
			message.reply({ embeds: [embed], ephemeral: true });
		} catch (err) {
			message.reply({ content: `${emojis.error} ${unicode.bullet} Bir hata oluştu!\n\`\`\`js\n${err}\`\`\``, ephemeral: true });
		}
	}
};

export default linkKisalt;
