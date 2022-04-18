import { SlashCommandBuilder } from "@discordjs/builders";
import { DiscordCommand } from "../types";

const kacCm: DiscordCommand = {
	conf: {
		aliases: ["kaçcm"],
		permLevel: 0,
		category: "Eğlence",
	},

	help: {
		name: "kaç-cm",
		description: "Malafatının kaç santim olduğunu söyler.",
		usage: "kaç-cm",
	},

	slashCommand: () => new SlashCommandBuilder(),

	execute({ message }) {
		message.reply({ content: `Senin malafatın **${Math.floor(Math.random() * 90) + 1 + (Math.floor(Math.random() * 3) ? "CM" : "KM")}**! :eggplant:`, ephemeral: true });
	},
};
export default kacCm;
