import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed, Permissions } from "discord.js";
import { DiscordCommand } from "../types";

const duyuru: DiscordCommand = {
	conf: {
		aliases: ["duyuru-yap", "duyuruyap"],
		permLevel: Permissions.FLAGS.MANAGE_MESSAGES,
		category: "Moderasyon",
		guildOnly: true
	},

	help: {
		name: "duyuru",
		description: "Bulunduğunuz kanalda duyuru yapar.",
		usage: "duyuru <başlık> <mesaj>"
	},

	slashCommand: () => new SlashCommandBuilder().addStringOption(option => option.setName("başlık").setDescription("Duyuru başlığı").setRequired(true)).addStringOption(option => option.setName("mesaj").setDescription("Duyuru yazısı").setRequired(true)),

	execute({ client, message, args, emojis, unicode, isSlash }) {
		const msg = isSlash ? args[1]["value"].trim() : args.slice(1).join(" ").trim();
		// @ts-ignore
		const title = isSlash ? args[0]["value"].trim() : args[0]?.replaceAll?.("_", " ").trim?.();
		if (!title) return message.reply(`${emojis.error} ${unicode.bullet} Lütfen bir başlık girin.`);
		if (!msg) return message.reply(`${emojis.error} ${unicode.bullet} Lütfen bir mesaj girin.`);
		if (msg.length > 2000) return message.reply({ content: `${emojis.error} ${unicode.bullet} Mesaj çok uzun.`, ephemeral: true });
		if (title.length > 100) return message.reply({ content: `${emojis.error} ${unicode.bullet} Başlık çok uzun.`, ephemeral: true });
		const embed = new MessageEmbed()
			.setColor("GREEN")
			.setDescription(msg)
			.setFooter({ text: `${client.user.username} - Duyuru Sistemi`, iconURL: client.user.avatarURL() })
			.setTimestamp()
			.setTitle(title)
			.setThumbnail("https://backto.iku.edu.tr/sites/default/files/articles/duyuru-1.png")
			.setAuthor({ name: message.author.username, iconURL: message.author.avatarURL() });
		if (!isSlash) message.delete();
		else message.reply({ content: `${emojis.success} ${unicode.bullet} Duyuru yapıldı.`, ephemeral: true });
		message.channel.send({ embeds: [embed] });
	}
};

export default duyuru;
