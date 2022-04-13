const { SlashCommandBuilder } = require("@discordjs/builders");
const figlet = require("figlet");
const limit = 50;

module.exports = {
	conf: {
		aliases: [],
		permLevel: 0,
		category: "Eğlence",
	},

	help: {
		name: "ascii",
		description: "Ascii şeklinde yazı yazmanızı sağlar.",
		usage: "ascii <mesaj>",
	},

	slashCommand: () => new SlashCommandBuilder().addStringOption(option => option.setDescription("Ascii halinde yazılıcak mesaj").setName("mesaj").setRequired(true)),

	execute({ message, args, emojis, unicode, isSlash }) {
		args = isSlash ? [args[0]?.value] : args;
		if (!args[0]) return message.reply({ content: `${emojis.error} ${unicode.bullet} Bir mesaj belirtmelisin!`, ephemeral: true });
		if (args.join(" ").length > limit) return message.reply({ content: `${emojis.error} ${unicode.bullet} Mesaj limiti ${limit} karakterden fazla olamaz!`, ephemeral: true });

		figlet(args.join(" "), (err, data) => {
			if (err) throw err;
			message.reply({ content: "```\n" + data + "\n```", ephemeral: true });
		});
	},
};
