import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageAttachment, Permissions } from "discord.js";
import { DiscordCommand } from "../types";
import Jimp from "jimp";

const wasted: DiscordCommand = {
	conf: {
		aliases: [],
		permLevel: Permissions.DEFAULT,
		category: "Eğlence"
	},

	help: {
		name: "wasted",
		description: "Profil fotorafınıza wasted efekti ekler.",
		usage: "wasted [@kullanıcı]"
	},

	slashCommand: () => new SlashCommandBuilder().addUserOption(option => option.setName("kullanıcı").setDescription("Kullanıcı").setRequired(false)),

	execute({ message, args, isSlash }) {
		const userPfp = isSlash ? message.guild.members.cache.get(args[0]["value"])?.user?.avatarURL?.({ format: "png" }) ?? message.author.avatarURL({ format: "png" }) : message.mentions.users.first()?.avatarURL?.({ format: "png" }) ?? message.author.avatarURL({ format: "png" });
		message.channel.sendTyping();
		Promise.all([Jimp.read(userPfp), Jimp.read("https://cdn.glitch.global/ba740ea3-c47d-4b74-b778-521867f1784b/wasted.png")]).then(imgs =>
			imgs[0]
				.resize(720, 620)
				.greyscale()
				.gaussian(3)
				.composite(imgs[1].resize(720, 620), 4, 0)
				.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
					if (err) throw err;
					message.reply({ files: [new MessageAttachment(buffer)], ephemeral: true });
				})
		);
	}
};

export default wasted;
