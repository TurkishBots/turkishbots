import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed, Permissions } from "discord.js";
import { DiscordCommand } from "../types";

const kick: DiscordCommand = {
	conf: {
		aliases: ["at", "sunucudanat", "sunucudan-at", "kickle"],
		permLevel: "KICK_MEMBERS",
		category: "Moderasyon",
		guildOnly: true,
	},

	help: {
		name: "kick",
		description: "İstediğiniz kullanıcı sunucudan atar.",
		usage: "kick <@kullanıcı> [atılma-sebebi]",
	},

	slashCommand: () => new SlashCommandBuilder().addUserOption(option => option.setName("kullanıcı").setDescription("Sunucudan atılıcak kullanıcı").setRequired(true)).addStringOption(option => option.setName("sebep").setDescription("Atılma sebebi").setRequired(false)),

	async execute({ client, message, args, emojis, unicode, isOwner, isSlash }) {
		if (!message.mentions.users.size) return message.reply({ content: `${emojis.error} ${unicode.bullet} Lütfen atılmasını istediğiniz kullanıcıyı etiketleyin.`, ephemeral: true });

		const user = isSlash ? message.guild.members.cache.get(args[0]["value"])?.user : message.mentions.users.first();
		// @ts-ignore
		const reason = isSlash ? args[1]?.["value"] ?? "Belirtilmemiş" : args[1]?.trim() ? args.slice(1).join(" ")?.trim() : "Belirtilmemiş";
		const member = message.guild.members.cache.get(user.id);

		if (!user || !member) return message.reply({ content: `${emojis.error} ${unicode.bullet} Kullanıcıyı sunucuda bulamadım.`, ephemeral: true });
		if (user.id === message.author.id) return message.reply({ content: `${emojis.error} ${unicode.bullet} Kendini nasıl atmayı düşünüyorsun?`, ephemeral: true });
		if (user.id === client.user.id) return message.reply({ content: `${emojis.error} ${unicode.bullet} Beni neden atmaya çalışıyorsun :(`, ephemeral: true });
		if (!isOwner && member.roles.highest.position > message.member.roles.highest.position) return message.reply({ content: `${emojis.error} ${unicode.bullet} Atmak istediğin kullanıcının yetkisi senin yetkinden daha yüksek!`, ephemeral: true });
		if (member.permissions.has(Permissions.FLAGS.MANAGE_GUILD) || member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return message.reply({ content: `${emojis.error} ${unicode.bullet} Yetkilileri sunucudan atamam!`, ephemeral: true });
		if (!member.bannable) return message.reply({ content: `${emojis.error} ${unicode.bullet} Bu kullanıcıyı sunucudan atamıyorum çünkü \`Benden daha yüksek bir role sahip\` veya \`Bana gerekli yetkileri vermedin\``, ephemeral: true });

		const kick = await member.kick(reason).catch(err => message.reply(`${emojis.error} ${unicode.bullet} Bir hata oluştu\n\`\`\`js\n${err.toString()}\`\`\``));
		if (kick) {
			const embed = new MessageEmbed();
			embed.setColor("YELLOW");
			embed.setAuthor({ name: message.author.username, iconURL: message.author.avatarURL() });
			embed.setDescription(`**${user}** sunucudan atıldı!`);
			embed.addField("Atılma sebebi:", reason);
			embed.addField("Atan:", `${message.author} (${message.author.id})`);
			embed.setFooter({ text: user.tag, iconURL: user.avatarURL() });
			embed.setTimestamp();
			embed.setTitle("Atılma emri");
			embed.setThumbnail("https://icon-library.com/images/kicking-icon/kicking-icon-28.jpg");
			message.reply({ embeds: [embed] });
		}
	},
};

export default kick;
