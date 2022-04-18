import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed, Permissions } from "discord.js";
import { DiscordCommand } from "../types";

const warn: DiscordCommand = {
	conf: {
		aliases: ["uyar"],
		permLevel: "MODERATE_MEMBERS",
		category: "Moderasyon",
		guildOnly: true,
	},

	help: {
		name: "warn",
		description: "Bir kullanıcıyı uyarır.",
		usage: "warn <@kullanıcı> <sebep>",
	},

	slashCommand: () => new SlashCommandBuilder().addUserOption(option => option.setDescription("Kullanıcı").setName("kullanıcı").setRequired(true)).addStringOption(option => option.setDescription("Sebep").setName("sebep").setRequired(true)),

	async execute({ client, message, args, emojis, unicode, isSlash }) {
		const member = isSlash ? message.guild.members.cache.get(args[0]["value"]) : message.mentions.members.first();
		const reason = isSlash ? args[1]["value"].trim() : args.slice(1).join(" ")?.trim?.();
		if (!member) return message.reply(`${emojis.error} ${unicode.bullet} Lütfen uyarmak için bir kullanıcıyı etiketleyin.`);
		if (!reason) return message.reply(`${emojis.error} ${unicode.bullet} Lütfen uyarı sebebini yazınız.`);
		const warnCount = member.roles.cache.filter(r => r.name.startsWith("Uyarı")).size || 0;

		if (member.id === message.author.id) return message.reply({ content: `${emojis.error} ${unicode.bullet} Kendini uyaramazsın.`, ephemeral: true });
		if (member.id === client.user.id) return message.reply({ content: `${emojis.error} ${unicode.bullet} Beni uyaramazsın.`, ephemeral: true });
		if (member.id === message.guild.ownerId) return message.reply({ content: `${emojis.error} ${unicode.bullet} Sunucu sahibini uyaramazsın.`, ephemeral: true });
		if (member.permissions.has(Permissions.FLAGS.ADMINISTRATOR) || member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return message.reply({ content: `${emojis.error} ${unicode.bullet} Yetkilileri uyaramazsın.`, ephemeral: true });
		if (member.roles.highest.position >= message.member.roles.highest.position) return message.reply({ content: `${emojis.error} ${unicode.bullet} Uyarmak istediğin kullanıcının yetkisi senden daha yüksek.`, ephemeral: true });

		const embed = new MessageEmbed()
			.setColor("RANDOM")
			.setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
			.setDescription(`Dikkat, ${message.author} tarafından bir uyarı aldın! **(${warnCount + 1}/3)**`)
			.addField("Sebep", reason)
			.setTimestamp()
			.setFooter({ text: member.user.tag, iconURL: member.user.avatarURL() })
			.setTitle("Uyarı");

		await member.send({ embeds: [embed] }).catch(() => {});
		if (warnCount + 1 >= 3) await member.kick(`Bu kullanıcı 3 uyarı aldığı için atıldı.`).catch(() => {});
		else await member.roles.add(message.guild.roles.cache.find(r => r.name === `Uyarı ${warnCount + 1}`).id);
		message.reply({ content: `${emojis.success} ${unicode.bullet} Kullanıcı uyarıldı. **(${warnCount + 1}/3)**`, ephemeral: true });
	},
};

export default warn;
