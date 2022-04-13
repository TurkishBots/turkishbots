const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageAttachment } = require("discord.js");
const Jimp = require("jimp");

module.exports = {
	conf: {
		aliases: [],
		permLevel: 0,
		category: "Eğlence",
	},

	help: {
		name: "bjk",
		description: "Profil fotorafınıza beşiktaş efekti ekler.",
		usage: "bjk [@kullanıcı]",
	},

	slashCommand: () => new SlashCommandBuilder().addUserOption(option => option.setName("kullanıcı").setDescription("Kullanıcı").setRequired(false)),

	execute({ message, args, isSlash }) {
		const author = isSlash ? message.user : message.author;
		const userPfp = isSlash ? (args[0]?.value ? message.guild.members.cache.get(args[0].value).user.avatarURL({ format: "png" }) : author.avatarURL({ format: "png" })) : message.mentions.users.first()?.avatarURL?.({ format: "png" }) ?? author.avatarURL({ format: "png" });
		message.channel.sendTyping();
		Promise.all([Jimp.read(userPfp), Jimp.read("https://cdn.glitch.global/ba740ea3-c47d-4b74-b778-521867f1784b/bjk.png")]).then(imgs =>
			imgs[0]
				.resize(720, 620)
				.composite(imgs[1].resize(720, 620), 0, 0)
				.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
					if (err) throw err;
					message.reply({ files: [new MessageAttachment(buffer)], ephemeral: true });
				})
		);
	},
};
