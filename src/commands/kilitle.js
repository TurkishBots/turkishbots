const { SlashCommandBuilder } = require("@discordjs/builders");
const ms = require("ms");

const formatTime = time => time.replaceAll("saniye", "second").replaceAll("dakika", "minute").replaceAll("saat", "hour").replaceAll("gün", "day").replaceAll("hafta", "week").replaceAll("yıl", "year");

module.exports = {
	conf: {
		aliases: ["lock", "kanal-kilitle", "kanalkilitle"],
		permLevel: "MANAGE_CHANNELS",
		category: "Moderasyon",
		guildOnly: true,
	},

	help: {
		name: "kilitle",
		description: "Komutu kullandığınız kanalı belirttiğiniz süre zarfında kilitler.",
		usage: "kilitle <süre>",
	},

	slashCommand: () => new SlashCommandBuilder().addStringOption(option => option.setName("süre").setDescription("Kilitli kalıcak süre").setRequired(true)),

	execute({ client, message, args, emojis, unicode }) {
		if (!client.lockit) client.lockit = [];
		const time = args.join(" ").trim();
		if (!time) return message.reply(`${emojis.error} ${unicode.bullet} Lütfen bir zaman belirtin`);
		if (!ms(formatTime(time))) return message.reply({ content: `${emojis.error} ${unicode.bullet} Lütfen geçerli bir zaman belirtin`, ephemeral: true });
		message.channel.permissionOverwrites.edit(message.guild.id, { SEND_MESSAGES: false }).then(() =>
			message.channel
				.send("🔒 Kanal kilitlendi!")
				.then(m => {
					client.lockit[message.channel.id] = setTimeout(() => {
						message.channel.permissionOverwrites.edit(message.guild.id, { SEND_MESSAGES: null }).then(m.reply("🔓 Kanalın kilidi açıldı.")).catch(console.error);
						delete client.lockit[message.channel.id];
					}, ms(formatTime(time)));
				})
				.catch(error => {
					message.reply({ content: `${emojis.error} ${unicode.bullet} Bir hata oluştu!\n\`\`\`js\n${error}\`\`\``, ephemeral: true });
					console.error(error);
				})
		);
	},
};
