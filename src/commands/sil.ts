import { SlashCommandBuilder } from "@discordjs/builders";
import { TextChannel, Permissions } from "discord.js";
import { DiscordCommand } from "../types";

const sil: DiscordCommand = {
	conf: {
		aliases: ["clear", "temizle"],
		permLevel: Permissions.FLAGS.MANAGE_MESSAGES,
		category: "Moderasyon",
		guildOnly: true
	},

	help: {
		name: "sil",
		description: "Belirttiğiniz sayıda mesajı siler.",
		usage: "sil <mesaj-sayısı>"
	},

	slashCommand: () => new SlashCommandBuilder().addIntegerOption(option => option.setDescription("Mesaj Sayısı").setName("sayı").setMaxValue(100).setMinValue(2).setRequired(true)),

	async execute({ message, args, emojis, unicode, isSlash }) {
		const amount = isSlash ? args[0]["value"] : args[0];
		if (!amount) return message.reply(`${emojis.error} ${unicode.bullet} Lütfen silinecek mesaj sayısını belirtin.`);
		if (isNaN(parseInt(amount))) return message.reply(`${emojis.error} ${unicode.bullet} Lütfen geçerli bir sayı girin.`);
		if (amount > 100) return message.reply(`${emojis.error} ${unicode.bullet} Discord API yalnızca maximum 100 mesaj silmeme olanak sağlıyor.`);
		if (amount < 2) return message.reply(`${emojis.error} ${unicode.bullet} En az 2 mesaj silebilirim.`);
		const del = await (message.channel as TextChannel).bulkDelete(parseInt(amount) + 1).catch(() => {});
		if (del) message.channel.send({ content: `${emojis.success} ${unicode.bullet} **${del.size - 1}** adet mesaj silindi.`, ephemeral: true }).then(m => setTimeout(_ => m.delete(), 5000));
	}
};

export default sil;
