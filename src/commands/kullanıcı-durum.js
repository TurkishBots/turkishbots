const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
	conf: {
		aliases: [],
		permLevel: 0,
		category: "Genel",
		guildOnly: true,
	},

	help: {
		name: "kullanıcı-durum",
		description: "Kullanıcının Discord'a nasıl bağlandığını öğrenirsiniz.",
		usage: "kullanıcı-durum <@kullanıcı>",
	},

	slashCommand: () => new SlashCommandBuilder().addUserOption(option => option.setDescription("Durumuna bakılıcak kullanıcı").setName("kullanıcı").setRequired(true)),

	execute({ client, message, args, emojis, unicode, isSlash }) {
		const user = isSlash ? message.guild.members.cache.get(args[0]?.value) : message.guild.members.cache.get(message.mentions.users.first()?.id);
		if (!user) return message.reply({ content: `${emojis.error} ${unicode.bullet} Lütfen bir kullanıcı etiketleyin!`, ephemeral: true });
		const embed = new MessageEmbed();
		embed.setAuthor({ name: user.user.tag, iconURL: user.user.avatarURL() });
		embed.setColor("RANDOM");
		embed.setThumbnail(user.user.avatarURL());
		embed.addField("ID", user.id, true);
		embed.addField("Kullanıcı Adı", user.user.username, true);
		if (user?.presence?.clientStatus) {
			user.presence?.activities?.forEach?.(activity => {
				if (activity.type === "CUSTOM") embed.addField("Özel Durum", activity.state, true);
				if (activity.type === "LISTENING") embed.addField("Dinleniyor", activity.name, true);
				if (activity.type === "PLAYING") embed.addField("Oynuyor", activity.name, true);
				if (activity.type === "WATCHING") embed.addField("İzliyor", activity.name, true);
				if (activity.type === "STREAMING") embed.addField("Yayın yapıyor", activity.name, true);
			});
			for (const platform in user.presence.clientStatus) {
				const formatStatus = () => {
					if (user.presence.clientStatus[platform] === "online") return "Çevrimiçi";
					if (user.presence.clientStatus[platform] === "idle") return "Boşta";
					if (user.presence.clientStatus[platform] === "dnd") return "Rahatsız Etmeyin";
					if (user.presence.clientStatus[platform] === "invisible") return "Görünmez";
					if (user.presence.clientStatus[platform] === "offline") return "Çevrimdışı";
				};
				if (platform === "desktop") embed.addField("💻 Masaüstü", formatStatus(), true);
				if (platform === "mobile") embed.addField("📱 Mobil", formatStatus(), true);
				if (platform === "web") embed.addField("🌐 Web", formatStatus(), true);
			}
		} else embed.addField("Durum", "Çevrimdışı", true);
		message.reply({ embeds: [embed], ephemeral: true });
	},
};
