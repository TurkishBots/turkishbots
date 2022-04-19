import { SlashCommandBuilder } from "@discordjs/builders";
import { DiscordCommand } from "../types";

const komutYenile: DiscordCommand = {
	conf: {
		aliases: ["komutyenile", "komutuyenile", "reload-command"],
		permLevel: "OWNER",
		category: "Admin",
	},

	help: {
		name: "komut-yenile",
		description: "Belirttiğiniz komutu yeniden başlatır.",
		usage: "komut-yenile <komut>",
	},

	slashCommand: () => new SlashCommandBuilder().addStringOption(option => option.setName("komut").setDescription("Yenilenecek komut").setRequired(true)),

	execute({ client, message, args, emojis, unicode, isSlash }) {
		if (!args[0]) return message.reply({ content: `${emojis.error} ${unicode.bullet} Lütfen bir komut ismi giriniz`, ephemeral: true });
		const command = (isSlash ? args[0]["value"] : args[0]).toLowerCase();

		try {
			delete require.cache[require.resolve(`./${command}.js`)];
			const pull: DiscordCommand = require(`./${command}.js`).default;
			client.commands.set(pull.help.name, pull);

			message.reply({ content: `${emojis.success} ${unicode.bullet} Yeniden başlatıldı: \`${command}\``, ephemeral: true });
		} catch (e) {
			if (e.code === "MODULE_NOT_FOUND") return message.reply({ content: `${emojis.error} ${unicode.bullet} Komut \`${command}\` bulunamadı!`, ephemeral: true });
			console.error(e);
			return message.reply({ content: `${emojis.error} ${unicode.bullet} Komut yeniden yüklenemedi! \`${command}\`\n\`\`\`js\n${e}\`\`\``, ephemeral: true });
		}
	},
};

export default komutYenile;
