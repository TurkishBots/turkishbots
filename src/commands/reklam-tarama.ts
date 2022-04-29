import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed, Permissions } from "discord.js";
import { DiscordCommand } from "../types";

const adRegex = /(https?:\/\/(.*)\.(.*)|(discord)?\.gg\/(.*))/g;

const reklamTarama: DiscordCommand = {
	conf: {
		aliases: ["reklamtara", "reklam-tara", "reklamtarama"],
		permLevel: Permissions.FLAGS.MODERATE_MEMBERS,
		category: "Moderasyon",
		guildOnly: true
	},

	help: {
		name: "reklam-tarama",
		description: "Sunucudaki kullanıcıların isimini, oyununu ve durumunda reklam olup olmadığını kontrol eder .",
		usage: "reklam-tarama"
	},

	slashCommand: () => new SlashCommandBuilder(),

	execute({ client, message }) {
		const catchedMembers = {
			username: [],
			game: [],
			status: []
		};
		message.guild.members.cache
			.filter(member => !member.user.bot)
			.forEach(member => {
				if (adRegex.test(member.user.username.toLowerCase()) || adRegex.test(member?.nickname?.toLowerCase?.())) catchedMembers.username.push(member);
				member.presence?.activities?.forEach?.(activity => {
					if (adRegex.test(activity[activity.type === "PLAYING" ? "name" : "state"]?.toLowerCase?.())) {
						if (activity.type === "PLAYING") catchedMembers.game.push(member);
						else if (activity.type === "CUSTOM") catchedMembers.status.push(member);
					}
				});
			});
		const embed = new MessageEmbed();
		embed.setTitle("Reklam Taraması");
		embed.setColor("RANDOM");
		embed.setFooter({ text: `${client.user.username} - Tarama Sistemi`, iconURL: client.user.avatarURL() });
		embed.setTimestamp();
		embed.setAuthor({ name: message.author.username, iconURL: message.author.avatarURL() });
		embed.addField(
			"İsimlerinde reklam bulunan kullanıcılar",
			catchedMembers.username
				.map(member => `**${member.user.username}**`)
				.join("\n")
				.trim() || "İsminde reklam içeren hiç kullanıcı yok!"
		);
		embed.addField(
			"Oynuyor kısmında reklam bulunan kullanıcılar",
			catchedMembers.game
				.map(
					member =>
						`**${member.user.username}** = **${member.presence.activities
							.filter(a => a.type === "PLAYING" && adRegex.test(a.name.toLowerCase()))
							.map(a => a.name)
							.join(", ")}**`
				)
				.join("\n")
				.trim() || "Oynuyor kısmında reklam içeren hiç kullanıcı yok!"
		);
		embed.addField(
			"Durumunda reklam bulunan kullanıcılar",
			catchedMembers.status
				.map(
					member =>
						`**${member.user.username}** = **${member.presence.activities
							.filter(a => a.type === "CUSTOM")
							.map(a => a.state)
							.join(", ")}**`
				)
				.join("\n")
				.trim() || "Durumunda reklam içeren hiç kullanıcı yok!"
		);
		message.reply({ embeds: [embed], ephemeral: true });
	}
};

export default reklamTarama;
