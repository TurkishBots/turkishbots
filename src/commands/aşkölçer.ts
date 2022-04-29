import { DiscordCommand } from "../types";
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed, Permissions } from "discord.js";
import moment from "moment";

const askolcer: DiscordCommand = {
	conf: {
		aliases: ["aşk-ölçer", "ask-olcer", "askolcer", "ask", "aşk"],
		permLevel: Permissions.DEFAULT,
		category: "Eğlence",
		guildOnly: true
	},

	help: {
		name: "aşkölçer",
		description: "İki kullanıcı sarasındaki aşkı ölçer.",
		usage: "aşkölçer <@kullanıcı1> [@kullanıcı2]"
	},

	slashCommand: () => new SlashCommandBuilder().addUserOption(option => option.setDescription("İlk kullanıcı").setName("kullanıcı").setRequired(true)).addMentionableOption(option => option.setDescription("İkinci kullanıcı").setName("ikinci_kullanıcı").setRequired(false)),

	execute({ client, message, args, emojis, unicode, isOwner, isSlash }) {
		args = isSlash ? args.map((arg: any) => arg.value) : args;

		const user = isSlash ? message.guild.members.cache.get(args[0]["value"])?.user : message.mentions.users.first();
		const user2 = (isSlash ? message.guild.members.cache.get(args[1]?.["value"])?.user : message.mentions.users[1]) ?? message.author;

		if (!user) return message.reply(`${emojis.error} ${unicode.bullet} Lütfen en az 1 kişiyi etiketleyin\n**Örnek**\n\`${isSlash ? "/" : client.config.prefix}aşkölçer @gamerboy @tr\``);
		if (message.mentions.users.size === 3) return message.reply(`${emojis.error} ${unicode.bullet} Üçlü olsun güçlü olsun diyorsun fakat bunu hesaplayamam!`);
		if (message.mentions.users.size > 2) return message.reply(`${emojis.error} ${unicode.bullet} En fazla 2 kişiyi etiketleyebilirsin!`);
		if (user.id === client.user.id || user2.id === client.user.id) return message.reply({ content: `${emojis.error} ${unicode.bullet} Seni sevdiğimi zaten biliyorsun!`, ephemeral: true });
		if (user.bot || user2.bot) return message.reply({ content: `${emojis.error} ${unicode.bullet} Bir yapay zekaya **Aşık Olmak?!** ne tür bi yobazsın sen?`, ephemeral: true });
		if ((!args[1] && user.id === message.author.id) || (user.id === message.author.id && user2.id === message.author.id)) {
			return message.reply({ content: `${emojis.error} ${unicode.bullet} Kendini sevdiğini biliyorum, ölçsem bile hata çıkarırım çünkü kendine sevgin hesaplanamaz.`, ephemeral: true });
		}

		let cheats = false;
		if ((args[2] === "on" || args[1] === "on") && isOwner) cheats = true;
		if (cheats) console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss")}] [Commands] [AşkÖlçer] Hileler açık`);

		let mainResult = Math.floor(Math.random() * 101);
		let hearth = "";
		let bhearth = "";
		if (!cheats) {
			if (Math.floor(Math.round(mainResult / 10) * 10) >= 10) {
				let c = 0;
				for (let i = 0; i < Math.floor(Math.round(mainResult / 10)); i++) {
					hearth += "❤️";
					c++;
				}
				for (let x = c; x < 10; x++) bhearth += "🖤";
			} else {
				hearth = "🖤";
				bhearth = "🖤🖤🖤🖤🖤🖤🖤🖤🖤";
			}
		} else {
			hearth = "❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️";
			mainResult = 100;
		}

		let comment = "İsterseniz nikah memuru ben olabilirim <3";
		if (mainResult < 80) comment = "Biraz daha uğraşırsan olacak gibi :)";
		if (mainResult < 60) comment = "Eh biraz iş var gibi";
		if (mainResult < 40) comment = "Az da olsa bişeycikler hissediyor sana :)";
		if (mainResult < 20) comment = "Bu iş olmaz sen bunu unut :smoking:";

		const msgEmbed = new MessageEmbed();
		msgEmbed.setAuthor({ name: `${user.username} | ${user2.username}`, iconURL: user.displayAvatarURL() });
		msgEmbed.setDescription(`Aşk Yüzdesi: ${mainResult}\n${hearth}${bhearth}\n\n${comment}.`);
		msgEmbed.setColor(bhearth.length > hearth.length ? "#0d0d0d" : "RED");
		msgEmbed.setTimestamp();
		message.reply({ embeds: [msgEmbed] });
	}
};

export default askolcer;
