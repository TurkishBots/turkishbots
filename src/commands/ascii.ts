import { DiscordCommand } from "../types";
import { SlashCommandBuilder } from "@discordjs/builders";
import { Permissions } from "discord.js";
import figlet from "figlet";

const limit = 50;

const ascii: DiscordCommand = {
	conf: {
		aliases: [],
		permLevel: Permissions.DEFAULT,
		category: "Eğlence"
	},

	help: {
		name: "ascii",
		description: "Ascii şeklinde yazı yazmanızı sağlar.",
		usage: "ascii <mesaj>"
	},

	slashCommand: () => new SlashCommandBuilder().addStringOption(option => option.setDescription("Ascii halinde yazılıcak mesaj").setName("mesaj").setRequired(true)),

	execute({ message, args, emojis, unicode, isSlash }) {
		args = isSlash ? [args[0]["value"]] : args;
		if (!args[0]) return message.reply({ content: `${emojis.error} ${unicode.bullet} Bir mesaj belirtmelisin!`, ephemeral: true });
		if ((isSlash ? args[0]["value"] : args.join(" ")).length > limit) return message.reply({ content: `${emojis.error} ${unicode.bullet} Mesaj limiti ${limit} karakterden fazla olamaz!`, ephemeral: true });

		figlet(args.join(" "), (err, data) => {
			if (err) throw err;
			message.reply({ content: "```\n" + data + "```", ephemeral: true });
		});
	}
};

export default ascii;
