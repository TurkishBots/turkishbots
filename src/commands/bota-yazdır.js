const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	conf: {
		aliases: ["botyaz", "botayazdır"],
		permLevel: "OWNER",
		category: "Admin",
	},

	help: {
		name: "bota-yazdır",
		description: "Bota mesaj yazdırmanızı sağlar.",
		usage: "bota-yazdır <mesaj>",
	},

	slashCommand: () => new SlashCommandBuilder().addStringOption(option => option.setDescription("Bota yazdıracağınız mesaj").setName("mesaj").setRequired(true)),

	execute({ message, args, emojis, unicode, isSlash }) {
		args = isSlash ? [args[0]?.value] : args;
		if (!args[0]) return message.reply({ content: `${emojis.error} ${unicode.bullet} Bir mesaj belirtmelisin!`, ephemeral: true });
		if (!isSlash) message.delete();
		else message.reply({ content: `${emojis.success} ${unicode.bullet} Mesaj başarıyla gönderildi!`, ephemeral: true });
		message.channel.send(args.join(" ").trim());
	},
};
