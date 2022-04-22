import { SlashCommandBuilder } from "@discordjs/builders";
import { DiscordCommand } from "../types";

const threadSil: DiscordCommand = {
	conf: {
		aliases: ["threadsil", "delete-thread", "deletethread"],
		permLevel: "MANAGE_THREADS",
		category: "Moderasyon",
		guildOnly: true,
	},

	help: {
		name: "thread-sil",
		description: "Belirttiğiniz threadi siler.",
		usage: "thread-sil <#thread>",
	},

	slashCommand: () => new SlashCommandBuilder().addChannelOption(option => option.setName("thread").setDescription("Silinicek thread").addChannelTypes([10, 11]).setRequired(true)),

	async execute({ message, args, emojis, unicode, isSlash }) {
		const thread: string = isSlash ? args[0]["value"] : String(args[0]).replace(/<#/g, "").replace(/>/g, "");
		const threadChannel = await message.guild.channels.fetch(thread);
		if (!threadChannel) return message.reply({ content: `${emojis.error} ${unicode.bullet} Thread bulunamadı!`, ephemeral: true });
		await threadChannel.delete();
		message.reply({ content: `${emojis.success} ${unicode.bullet} Thread silindi.`, ephemeral: true });
	},
};

export default threadSil;
