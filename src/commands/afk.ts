import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed, Permissions } from "discord.js";
import { DiscordCommand } from "../types";
const db = require("../components/database")();

const afk: DiscordCommand = {
	conf: {
		aliases: ["afkol", "awayfromkeyboard", "afk-ol", "klavyedenuzakta", "klavyedenuzakta-ol"],
		permLevel: Permissions.DEFAULT,
		category: "Genel",
		guildOnly: true
	},

	help: {
		name: "afk",
		description: "AFK olursunuz (Birisi sizi etiketlediğinde AFK olduğunuzu söyler).",
		usage: "afk <afk-olma-nedeni>"
	},

	slashCommand: () => new SlashCommandBuilder().addStringOption(option => option.setDescription("Afk olma nedeni").setName("neden").setRequired(true)),

	execute({ client, message, args, emojis, unicode, isSlash }) {
		const reason = isSlash ? args[0]["value"] : args.join(" ");

		if (!reason) return message.reply({ content: `${emojis.error} ${unicode.bullet} Bir sebep belirtmelisin!`, ephemeral: true });

		if (reason.length < 3) return message.reply({ content: `${emojis.error} ${unicode.bullet} Sebep en az 3 karakterden oluşmalı!`, ephemeral: true });
		if (reason.length > 50) return message.reply({ content: `${emojis.error} ${unicode.bullet} Sebep en fazla 50 karakterden oluşmalı!`, ephemeral: true });

		db.set(`afks_${message.author.id}`, { reason: reason, time: Date.now() });

		const msgEmbed = new MessageEmbed();
		msgEmbed.setColor("RANDOM");
		msgEmbed.setTitle("AFK");
		msgEmbed.setDescription(`${message.author.username} artık AFK`);
		msgEmbed.addField("Sebep", `${reason}${reason.toLowerCase().match(/namaz kıl(ıyor|cam)/g) ? " Allah kabul etsin!" : ""}`);
		msgEmbed.setFooter({ text: `${client.user.username} AFK Sistemi`, iconURL: client.user.avatarURL() });
		msgEmbed.setTimestamp();
		if (!isSlash) {
			message.delete();
			message.channel.send({ embeds: [msgEmbed] });
		} else message.reply({ embeds: [msgEmbed] });
	}
};

export default afk;
