import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { DiscordCommand } from "../types";

const oylama: DiscordCommand = {
	conf: {
		aliases: ["oylama-yap"],
		permLevel: "MANAGE_MESSAGES",
		category: "Moderasyon",
		guildOnly: true,
	},

	help: {
		name: "oylama",
		description: "Oylama yaparsınız.",
		usage: "oylama <mesaj>",
	},

	slashCommand: () => new SlashCommandBuilder().addStringOption(option => option.setDescription("Oylama Mesajı").setName("mesaj").setRequired(true)),

	async execute({ client, message, args, emojis, unicode, isSlash }) {
		const text = isSlash ? args[0]["value"] : args.join(" ");
		if (!text?.trim?.()) return message.reply({ content: `${emojis.error} ${unicode.bullet} Lütfen bir mesaj giriniz!`, ephemeral: true });
		if (!isSlash) message.delete();
		else message.reply({ content: `${emojis.success} ${unicode.bullet} Başarılı!`, ephemeral: true });
		const embed = new MessageEmbed();
		embed.setTitle("Oylama");
		embed.setDescription(text);
		embed.setColor("RANDOM");
		embed.setFooter({ text: `${client.user.username} - Oylama Sistemi`, iconURL: client.user.displayAvatarURL() });
		embed.setTimestamp();
		embed.setThumbnail(client.user.displayAvatarURL());
		embed.setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() });
		const msg = await message.channel.send({ embeds: [embed] });
		await msg.react(emojis.plus_1);
		await msg.react(emojis.minus_1);
	},
};

export default oylama;
