import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { DiscordCommand } from "../types";

const kullaniciBilgi: DiscordCommand = {
	conf: {
		aliases: ["kullanıcıbilgi", "user", "kullanıcı"],
		permLevel: 0,
		category: "Genel",
		guildOnly: true,
	},

	help: {
		name: "kullanıcı-bilgi",
		description: "Etiketlediğiniz kullanıcı hakkında bilgi verir.",
		usage: "kullanıcı-bilgi <@kullanıcı>",
	},

	slashCommand: () => new SlashCommandBuilder().addUserOption(option => option.setDescription("Kullanıcı").setName("kullanıcı").setRequired(true)),

	execute({ message, args, emojis, unicode, isSlash }) {
		const member = isSlash ? message.guild.members.cache.get(args[0]["value"]) : message.mentions.members.first();
		if (!member) return message.reply(`${emojis.error} ${unicode.bullet} Lütfen bir kullanıcı etiketleyin.`);
		const embed = new MessageEmbed()
			.setColor("RANDOM")
			.setThumbnail(member.user.avatarURL())
			.setAuthor({ name: member.nickname ?? member.user.username, iconURL: member.user.avatarURL() })
			.setTimestamp()
			.setFooter({ text: member.user.tag, iconURL: member.user.avatarURL() })
			.addField("ID", member.user.id, true)
			.addField("Kullanıcı Adı", member.user.username, true)
			.addField(
				"Rolleri",
				member.roles.cache.filter(role => role.name !== "@everyone").size
					? member.roles.cache
							.filter(role => role.name !== "@everyone")
							.map(role => role)
							.join(", ")
					: "Kullanıcının bir rolü **yok**.",
				true
			)
			.addField("Discord Kayıt Tarihi :", `**<t:${Date.parse(member.user.createdAt.toLocaleString()) / 1000}:R>**`, true)
			.addField("Sunucuya Giriş Tarihi :", `**<t:${Date.parse(member.joinedAt.toLocaleString()) / 1000}:R>**`, true);
		message.reply({ embeds: [embed], ephemeral: true });
	},
};

export default kullaniciBilgi;
