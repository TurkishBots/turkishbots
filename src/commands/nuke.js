const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageAttachment } = require("discord.js");

module.exports = {
	conf: {
		aliases: [],
		permLevel: "MANAGE_MESSAGES",
		category: "Moderasyon",
		guildOnly: true,
	},

	help: {
		name: "nuke",
		description: "Kanaldaki tüm mesajları siler.",
		usage: "nuke",
	},

	slashCommand: () => new SlashCommandBuilder(),

	async execute({ message, emojis, unicode }) {
		const channel = await message.channel.clone({ position: message.channel.position }).catch(e => message.reply({ content: `${emojis.error} ${unicode.bullet} Bir hata oluştu!\n\`\`\`js\n${e.toString()}\`\`\``, ephemeral: true }));
		channel.send({ content: "Nuked", files: [new MessageAttachment("./img/nuke.gif")] }).then(m => setTimeout(() => m.delete(), 5000));
		message.channel.delete().catch(() => {});
	},
};
