const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

const formatDate = date => {
	const d = new Date(date);
	const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
	return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
};

module.exports = {
	conf: {
		aliases: ["sunucu", "sunucubilgi", "sbilgi"],
		permLevel: 0,
		category: "Genel",
		guildOnly: true,
	},

	help: {
		name: "sunucu-bilgi",
		description: "Sunucu hakkında bilgi verir.",
		usage: "sunucubilgi",
	},

	slashCommand: () => new SlashCommandBuilder(),

	execute({ message }) {
		const guild = message.guild;
		const embed = new MessageEmbed()
			.setColor("RANDOM")
			.setTimestamp()
			.setAuthor({ name: guild.name, iconURL: guild.iconURL() })
			.setThumbnail(guild.iconURL())
			.addField("Sunucu ID", guild.id, true)
			.addField("Sunucu İsmi", guild.name, true)
			.addField("Sunucu Resmi", guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp` : "Yok")
			.addField("Sunucu Davet Arkaplanı", guild.splash ? `https://cdn.discordapp.com/splashes/${guild.id}/${guild.splash}.jpg` : "Yok")
			.addField("Sunucu Afişi", guild.banner ? `https://cdn.discordapp.com/banners/${guild.id}/${guild.banner}.webp` : "Yok")
			.addField("Sunucu Kuruluş Tarihi", formatDate(guild.createdAt), true)
			.addField("Kullanıcı Sayısı", guild.memberCount.toString(), true)
			.addField("Kanal Sayısı", guild.channels.cache.size.toString(), true)
			.addField("Sunucu Açıklaması", guild.description ? guild.description : "Yok", true)
			.addField("Sunucu Doğrulama Seviyesi", guild.verificationLevel, true)
			.addField("Sunucu Özel URL'si", guild.vanityURLCode ? `[discord.gg/${guild.vanityURLCode}](${guild.vanityURLCode})` : "Yok", true)
			.addField("Sunucu Büyük", guild.large ? "Evet" : "Hayır", true)
			.addField("Sunucu Boost Çubuğu Etkin", guild.premiumProgressBarEnabled ? "Evet" : "Hayır", true)
			.addField("Sunucu AFK Zaman Aşımı", guild.afkTimeout ? guild.afkTimeout.toString() : "Yok", true)
			.addField("Sunucu AFK Kanalı", guild.afkChannelId ? `<#${guild.afkChannelId}>` : "Yok", true)
			.addField("Sunucu Sistem Kanalı", guild.systemChannelId ? `<#${guild.systemChannelId}>` : "Yok", true)
			.addField("Sunucu Boost Seviyesi", guild.premiumTier ? guild.premiumTier : "Yok", true)
			.addField("Sunucu Boost Sayısı", guild.premiumSubscriptionCount.toString(), true)
			.addField("Sunucu Maksimum Kullanıcı Sayısı", guild.maximumMembers.toString(), true)
			.addField("Sunucu Kurallar Kanalı", guild.rulesChannelId ? `<#${guild.rulesChannelId}>` : "Yok", true)
			.addField("Sunucu Duyuru Kanalı", guild.publicUpdatesChannelId ? `<#${guild.publicUpdatesChannelId}>` : "Yok", true)
			.addField("Sunucu Sahibi", `<@!${guild.ownerId}>`, true);
		message.reply({ embeds: [embed], ephemeral: true });
	},
};
