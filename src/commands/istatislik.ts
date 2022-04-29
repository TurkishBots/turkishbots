import { SlashCommandBuilder } from "@discordjs/builders";
import { DiscordCommand } from "../types";
import { MessageEmbed, version as dcversion, Permissions } from "discord.js";
import moment from "moment";
import "moment-duration-format";
import os from "os";
const { version } = require("../../package.json");

const istatislik: DiscordCommand = {
	conf: {
		aliases: ["i", "botistatislik", "botistatislikleri", "bot-istatislik", "bot-istatislikleri", "istatislikler"],
		permLevel: Permissions.DEFAULT,
		category: "Genel"
	},

	help: {
		name: "istatislik",
		description: "Botun istatisliklerini gösterir.",
		usage: "istatislik"
	},

	slashCommand: () => new SlashCommandBuilder(),

	async execute({ client, message, emojis }) {
		const getStatus = (ping: number) => {
			let status: string;
			if (ping >= 0 && ping < 50) status = "Mükemmel";
			else if (ping >= 50 && ping < 150) status = "İdare Eder";
			else if (ping >= 150 && ping < 200) status = "Kötü";
			else if (ping >= 200) status = "Çok Kötü";
			else status = "Hata";
			return status;
		};
		const m = await message.channel.send("Hesaplıyorum...");
		const ping = m.createdTimestamp - message.createdTimestamp;
		m.delete();
		const embed = new MessageEmbed()
			.setColor("RANDOM")
			.setTimestamp()
			.setFooter({ text: `Yusuf © ${new Date().getFullYear()} ${client.user.username}`, iconURL: client.user.avatarURL() })
			.addField("» :crown: **Botun Programcısı**", "<@!530043492014096384>", true)
			.addField("» :stopwatch: **Gecikme Süreleri**", `Mesaj Gecikmesi: ${ping}ms (${getStatus(ping)})\nSocket Gecikmesi: ${client.ws.ping}ms (${getStatus(client.ws.ping)})`, true)
			.addField("» :electric_plug: **Bellek Kullanımı**", (process.memoryUsage().heapUsed / 1024 / 512).toFixed(2) + " MB", true)
			// @ts-ignore
			.addField("» :watch: **Çalışma Süresi**", moment.duration(client.uptime).format(" M [ay], D [gün], H [saat], m [dakika], s [saniye]"), true)
			.addField(`» ${emojis.members} **Kullanıcılar**`, client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString(), true)
			.addField(`» ${emojis.channel} **Kanallar**`, client.channels.cache.size.toString(), true)
			.addField(`» ${emojis.discordjs} **Discord.JS Sürümü**`, "v" + dcversion, true)
			.addField(`» ${emojis.nodejs} **Node.JS Sürümü**`, process.version, true)
			.addField("» :robot: **Bot Sürümü**", !isNaN(parseInt(version)) ? "v" + version : version, true)
			.addField("» **Shards**", client.ws.shards.size.toString(), true)
			.addField("» **Cores**", os.cpus().length.toString(), true)
			.addField("» **Bit**", `\`${os.arch()}\``, true)
			.addField("» **CPU**", `\`\`\`md\n${os.cpus().map(i => i.model)[0]}\`\`\``, true)
			.addField("» **İşletim Sistemi**", `\`\`${os.platform()}\`\``, true);
		message.reply({ embeds: [embed], ephemeral: true });
	}
};

export default istatislik;
