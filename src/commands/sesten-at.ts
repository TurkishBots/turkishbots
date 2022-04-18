import { SlashCommandBuilder } from "@discordjs/builders";
import { Permissions } from "discord.js";
import { DiscordCommand } from "../types";

const sestenAt: DiscordCommand = {
	conf: {
		aliases: ["sestenat"],
		permLevel: "MOVE_MEMBERS",
		category: "Moderasyon",
		guildOnly: true,
	},

	help: {
		name: "sesten-at",
		description: "Kullanıcıyı sesten atar.",
		usage: "sesten-at <kullanıcı>",
	},

	slashCommand: () => new SlashCommandBuilder().addUserOption(option => option.setName("kullanıcı").setDescription("Atılcak kullanıcı").setRequired(true)),

	execute({ client, message, args, emojis, unicode, isSlash }) {
		const user = isSlash ? message.guild.members.cache.get(args[0]["value"]) : message.guild.members.cache.get(message.mentions.users.first()?.id);
		if (!user) return message.reply({ content: `${emojis.error} ${unicode.bullet} Lütfen bir kullanıcı etiketleyin!`, ephemeral: true });
		if (user.id === message.author.id) return message.reply({ content: `${emojis.error} ${unicode.bullet} Kendini sesten atamazsın!`, ephemeral: true });
		if (user.id === client.user.id) return message.reply({ content: `${emojis.error} ${unicode.bullet} Beni sesten atamazsın!`, ephemeral: true });
		if (user.roles.highest.position > message.member.roles.highest.position) return message.reply({ content: `${emojis.error} ${unicode.bullet} Atmak istediğin kullanıcının yetkisi senin yetkinden daha yüksek!`, ephemeral: true });
		if (user.permissions.has(Permissions.FLAGS.MANAGE_GUILD) || user.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return message.reply({ content: `${emojis.error} ${unicode.bullet} Yöneticileri sesten atamazsın!`, ephemeral: true });
		user.voice.disconnect(`${message.author.username} tarafından sesten atıldı.`);
		message.reply({ content: `${emojis.success} ${unicode.bullet} ${user.user.username} adlı kullanıcı sesten atıldı!`, ephemeral: true });
	},
};

export default sestenAt;
