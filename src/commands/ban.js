const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, Permissions } = require("discord.js");

module.exports = {
	conf: {
		aliases: ["yasakla", "sunucudanyasakla", "sunucudan-yasakla", "banla"],
		permLevel: "BAN_MEMBERS",
		category: "Moderasyon",
		guildOnly: true,
	},

	help: {
		name: "ban",
		description: "İstediğiniz kullanıcı sunucudan yasaklar.",
		usage: "ban <@kullanıcı> [yasaklanma-sebebi]",
	},

	slashCommand: () => new SlashCommandBuilder().addUserOption(option => option.setName("kullanıcı").setDescription("Sunucudan yasaklanıcak kullanıcı").setRequired(true)).addStringOption(option => option.setName("sebep").setDescription("Yasaklanma sebebi").setRequired(false)),

	async execute({ client, message, args, emojis, unicode, isOwner, isSlash }) {
		const author = isSlash ? message.user : message.author;
		if (!isSlash && !message.mentions.users.size) return message.reply({ content: `${emojis.error} ${unicode.bullet} Lütfen yasaklanmasını istediğiniz kullanıcıyı etiketleyin.`, ephemeral: true });

		const user = isSlash ? message.guild.members.cache.get(args[1].value)?.user : message.mentions.users.first();
		if (message.guild.bans.cache.has(user.id)) return message.reply({ content: `${emojis.error} ${unicode.bullet} Bu kullanıcı zaten sunucudan yasaklanmış!`, ephemeral: true });
		const reason = isSlash ? args[1]?.value ?? "Belirtilmemiş" : args[1]?.trim() ? args.slice(1).join(" ")?.trim() : "Belirtilmemiş";
		const member = message.guild.members.cache.get(user.id);

		if (!user || !member) return message.reply({ content: `${emojis.error} ${unicode.bullet} Kullanıcıyı sunucuda bulamadım.`, ephemeral: true });
		if (user.id === author.id) return message.reply({ content: `${emojis.error} ${unicode.bullet} Kendini nasıl yasaklamayı düşünüyorsun?`, ephemeral: true });
		if (user.id === client.user.id) return message.reply({ content: `${emojis.error} ${unicode.bullet} Beni neden yasaklamaya çalışıyorsun :(`, ephemeral: true });
		if (!isOwner && user.position > message.member.roles.highest.position) return message.reply({ content: `${emojis.error} ${unicode.bullet} Yasaklamak istediğin kullanıcının yetkisi senin yetkinden daha yüksek!`, ephemeral: true });
		if (member.permissions.has(Permissions.FLAGS.MANAGE_GUILD) || member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return message.reply({ content: `${emojis.error} ${unicode.bullet} Yetkilileri sunucudan yasaklayamam!`, ephemeral: true });
		if (!member.bannable) return message.reply({ content: `${emojis.error} ${unicode.bullet} Bu kullanıcıyı sunucudan yasaklayamıyorum çünkü \`Benden daha yüksek bir role sahip\` veya \`Bana gerekli yetkileri vermedin\``, ephemeral: true });

		const ban = await member.ban({ reason }).catch(err => message.reply(`${emojis.error} ${unicode.bullet} Bir hata oluştu\n\`\`\`js\n${err.toString()}\`\`\``));
		if (ban) {
			const embed = new MessageEmbed();
			embed.setColor("RED");
			embed.setAuthor({ name: author.username, iconURL: author.avatarURL() });
			embed.setDescription(`**${user}** sunucudan yasaklandı!`);
			embed.addField("Yasaklanma sebebi:", reason);
			embed.addField("Yasaklayan:", `${author} (${author.id})`);
			embed.setFooter({ text: user.tag, iconURL: user.avatarURL() });
			embed.setTimestamp();
			embed.setTitle("Yasaklama emri");
			embed.setThumbnail("https://www.onlygfx.com/wp-content/uploads/2017/11/banned-stamp-2-3.png");
			message.reply({ embeds: [embed] });
		}
	},
};
