import { DiscordCommand } from "../types";
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageAttachment } from "discord.js";
import Jimp from "jimp";

const bjk: DiscordCommand = {
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
		const userPfp = isSlash ? message.guild.members.cache.get(args[0]?.["value"]).user.avatarURL({ format: "png" }) ?? message.author.avatarURL({ format: "png" }) : message.mentions.users.first()?.avatarURL?.({ format: "png" }) ?? message.author.avatarURL({ format: "png" });
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

export default bjk;
