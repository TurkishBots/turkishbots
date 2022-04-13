const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	conf: {
		aliases: ["clear", "temizle"],
		permLevel: "MANAGE_MESSAGES",
		category: "Moderasyon",
		guildOnly: true,
	},

	help: {
		name: "sil",
		description: "Belirttiğiniz sayıda mesajı siler.",
		usage: "sil <mesaj-sayısı>",
	},

	slashCommand: () => new SlashCommandBuilder().addIntegerOption(option => option.setDescription("Mesaj Sayısı").setName("sayı").setMaxValue(100).setMinValue(2).setRequired(true)),

	async execute({ client, message, args, emojis, unicode, isOwner, isSlash }) {
		const amount = isSlash ? args[0]?.value : args[0];
		if (!amount) return message.reply(`${emojis.error} ${unicode.bullet} Lütfen silinecek mesaj sayısını belirtin.`);
		if (isNaN(parseInt(amount))) return message.reply(`${emojis.error} ${unicode.bullet} Lütfen geçerli bir sayı girin.`);
		if (amount > 100) return message.reply(`${emojis.error} ${unicode.bullet} Discord API yalnızca maximum 100 mesaj silmeme olanak sağlıyor.`);
		if (amount < 2) return message.reply(`${emojis.error} ${unicode.bullet} En az 2 mesaj silebilirim.`);
		const { size } = await message.channel.bulkDelete(parseInt(amount) + 1).catch(() => {});
		message.channel.send({ content: `${emojis.success} ${unicode.bullet} **${size - 1}** adet mesaj silindi.`, ephemeral: true }).then(m => setTimeout(_ => m.delete(), 5000));
	},
};
