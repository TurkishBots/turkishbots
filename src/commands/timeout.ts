import { SlashCommandBuilder } from "@discordjs/builders";
import { Permissions, MessageEmbed, Message } from "discord.js";
import { DiscordCommand } from "../types";
import ms from "ms";
import axios from "axios";

const timeout: DiscordCommand = {
	conf: {
		aliases: ["zaman-aşımı", "zamanaşımı"],
		permLevel: Permissions.DEFAULT,
		category: "Moderasyon",
		guildOnly: true
	},

	help: {
		name: "timeout",
		description: "Belirttiğiniz kullanıcıyı belirttiğiniz süre zarfında zaman aşımına uğratır.",
		usage: "timeout <@kullanıcı> <zaman>"
	},

	slashCommand: () =>
		new SlashCommandBuilder().addUserOption(option => option.setName("kullanıcı").setDescription("Zaman aşımına uğratılıcak kullanıcı").setRequired(true)).addStringOption(option => option.setName("zaman").setDescription("Zaman aşımının süresi (örnek: 1d, 1h, 1m, 1s)").setRequired(true)),

	async execute({ client, message, args, emojis, unicode, isSlash }) {
		const member = isSlash ? message.guild.members.cache.get(args[0]["value"]) : message.mentions.members.first();
		const time = isSlash ? args[1]["value"] : args.slice(1).join(" ");
		if (!member) return message.reply(`${emojis.error} ${unicode.bullet} Lütfen bir kullanıcı etiketleyin.`);
		if (!time) return message.reply(`${emojis.error} ${unicode.bullet} Lütfen bir zaman belirtin.`);
		const milliseconds = parseInt(ms(time));
		if (!milliseconds || milliseconds < 10000 || milliseconds > 2419200000) return message.reply(`${emojis.error} ${unicode.bullet} Lütfen geçerli bir zaman belirtin.`);
		if (member.id === message.author.id) return message.reply(`${emojis.error} ${unicode.bullet} Kendini zaman aşımına uğratamazsın!`);
		if (member.id === client.user.id) return message.reply(`${emojis.error} ${unicode.bullet} Beni zaman aşımına uğratamazsın!`);
		if (member.permissions.has(Permissions.FLAGS.ADMINISTRATOR) || member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return message.reply(`${emojis.error} ${unicode.bullet} Yetkilileri zaman aşımına uğratamazsın!`);
		if (member.roles.highest.position >= message.member.roles.highest.position) return message.reply(`${emojis.error} ${unicode.bullet} Kendinden üst yetkiye sahip olanları zaman aşımına uğratamazsın!`);
		const timeoutUntil = new Date(Date.now() + milliseconds).toISOString();
		const req = await axios
			.patch(`https://discord.com/api/v9/guilds/${message.guild.id}/members/${member.id}`, JSON.stringify({ communication_disabled_until: timeoutUntil }), {
				headers: { "Content-Type": "application/json", Authorization: `Bot ${client.token}` }
			})
			.catch(e => message.reply(`${emojis.error} ${unicode.bullet} Bir hata oluştu.\n\`\`\`js\n${e}\`\`\``));
		if (req instanceof Message) return;
		const embed = new MessageEmbed();
		embed.setColor("YELLOW");
		embed.setAuthor({ name: message.author.username, iconURL: message.author.avatarURL() });
		embed.setDescription(`**${member.user}** zaman aşımına uğratıldı!`);
		embed.addField("Zaman aşımına uğratan:", `${message.author} (${message.author.id})`);
		embed.addField("Bitiş zamanı:", `<t:${new Date(timeoutUntil).getTime()}:R> (<t:${new Date(timeoutUntil).getTime()}>)`);
		embed.setFooter({ text: member.user.tag, iconURL: member.user.avatarURL() });
		embed.setTimestamp();
		embed.setTitle("Zaman aşımı emri");
		embed.setThumbnail("http://www.slate.com/features/2014/10/run/img/icon_839/icon_839.png");
		message.reply({ embeds: [embed] });
	}
};

export default timeout;
