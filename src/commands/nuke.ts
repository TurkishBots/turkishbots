import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageAttachment, TextChannel, Permissions } from "discord.js";
import { DiscordCommand } from "../types";

const nuke: DiscordCommand = {
	conf: {
		aliases: [],
		permLevel: Permissions.FLAGS.MANAGE_MESSAGES,
		category: "Moderasyon",
		guildOnly: true
	},

	help: {
		name: "nuke",
		description: "Kanaldaki tüm mesajları siler.",
		usage: "nuke"
	},

	slashCommand: () => new SlashCommandBuilder(),

	async execute({ message, emojis, unicode }) {
		const channel = await (message.channel as TextChannel).clone({ position: (message.channel as TextChannel).position }).catch(e => message.reply({ content: `${emojis.error} ${unicode.bullet} Bir hata oluştu!\n\`\`\`js\n${e.toString()}\`\`\``, ephemeral: true }));
		(channel as TextChannel).send({ content: "Nuked", files: [new MessageAttachment("./img/nuke.gif")] }).then(m => setTimeout(() => m.delete(), 5000));
		message.channel.delete().catch(() => {});
	}
};

export default nuke;
