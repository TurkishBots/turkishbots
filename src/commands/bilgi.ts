import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { DiscordCommand } from "../types";
const { version } = require("../../package.json");

const bilgi: DiscordCommand = {
	conf: {
		aliases: ["bot-bilgi"],
		permLevel: 0,
		category: "Genel",
	},

	help: {
		name: "bilgi",
		description: "Bot hakkında bilgi gösterir.",
		usage: "bilgi",
	},

	slashCommand: () => new SlashCommandBuilder(),

	execute({ client, message, emojis }) {
		const embed = new MessageEmbed();
		embed.setTitle("Bot Bilgileri");
		embed.setColor("RANDOM");
		embed.setThumbnail(client.user.displayAvatarURL());
		embed.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() });
		embed.setTimestamp();
		embed.setFooter({ text: `${client.user.username} Coded by Yusuf with ❤️`, iconURL: client.user.displayAvatarURL() });
		embed.addField("👨‍💻 Bot Programcısı", "<@!530043492014096384>", true);
		embed.addField("👑 Bot Kurucusu", "<@!830808204711559219>", true);
		embed.addField("❤️ Desktekçiler", "`N68-Yusuf`, `Ganyotçu` ve `Retrib` hepinize sonsuz teşekkürler", true);
		embed.addField("📚 Bot Dili", `${emojis.typescript} TypeScript`, true);
		embed.addField("📝 Bot Versiyonu", "v" + version, true);
		embed.addField("📊 Bot Gecikmesi", client.ws.ping + "ms", true);
		embed.addField(`${emojis.nodejs} NodeJS Versiyonu`, process.version, true);
		embed.addField(`${emojis.discordjs} DiscordJS Versiyonu`, "v" + require("discord.js").version, true);
		embed.addField(
			`${emojis.info} Bot Hakkında`,
			`Bu bot Yusuf tarafından TurkishMethods için yapılmış bir projedir. 2020-2021 yıllarında başlanmış ama bazı aksaklıklardan dolayı köşeye atılmıştır. 2022 yılında tekrar hayata tutunmayı başarmıştır. Bot ${emojis.typescript} \`TypeScript\`, ${emojis.nodejs} \`NodeJS\`, ${emojis.discordjs} \`Discord.JS\` ve daha birçok dil/paket kullanılarak yapılmıştır. Kodlayan Yusuf'a sonsuz teşekkürler.`
		);
		message.reply({ embeds: [embed], ephemeral: true });
	},
};

export default bilgi;
