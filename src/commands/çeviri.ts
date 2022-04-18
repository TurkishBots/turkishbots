import { DiscordCommand } from "../types";
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import translatte from "translatte";

const ceviri: DiscordCommand = {
	conf: {
		aliases: ["çevir"],
		permLevel: 0,
		category: "Genel",
	},

	help: {
		name: "çeviri",
		description: "Bir kelimeyi türkçeden ingilizceye çevirir.",
		usage: "çeviri <mesaj>",
	},

	slashCommand: () => new SlashCommandBuilder().addStringOption(option => option.setName("mesaj").setDescription("Çeviriceğiniz mesaj").setRequired(true)),

	execute({ client, message, args, emojis, unicode, isSlash }) {
		let text = isSlash ? args[0]["value"].trim() : args.join(" ").trim();
		if (message.type === "REPLY") text = message.channel.messages.cache.get(message.reference.messageId)?.content ?? text;
		if (!text) return message.reply({ content: `${emojis.error} ${unicode.bullet} Lütfen çevrilcek mesajı belirtin!`, ephemeral: true });
		translatte(text, { from: "tr", to: "en" })
			.then(res => {
				const embed = new MessageEmbed();
				embed.setTitle("Çeviri Sonuçları");
				embed.setAuthor({ name: message.author.username, iconURL: message.author.avatarURL() });
				embed.setColor("RANDOM");
				embed.setFooter({ text: `${client.user.username} - Çeviri Sistemi`, iconURL: client.user.avatarURL() });
				embed.setTimestamp();
				embed.addField("Çevrilen metin", text, true);
				embed.addField("Çeviri sonucu", res.text, true);
				if (res.from.text.didYouMean) embed.addField("Şunumu demek istediniz", res.from.text.value.replaceAll(/\[(.*)\]/g, "**$1**"), true);
				for (const service of Object.keys(res.service)) embed.addField("Çeviri servisi", service, true);
				message.reply({ embeds: [embed], ephemeral: true });
			})
			.catch(err => {
				console.error(err);
				return message.reply({ content: `${emojis.error} ${unicode.bullet} Bir hata oluştu!\n\`\`\`js\n${err.toString()}\`\`\``, ephemeral: true });
			});
	},
};

export default ceviri;
