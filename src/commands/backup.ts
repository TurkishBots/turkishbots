import { DiscordCommand } from "../types";
import { SlashCommandBuilder } from "@discordjs/builders";
import { stripIndents } from "common-tags";
import { TextChannel } from "discord.js";
import AdmZip from "adm-zip";
import path from "path";
import fs from "fs";

const zipper = new AdmZip();

const ignoredItems = ["yarn.lock", "package-lock.json", "backups", ".vscode", ".history", "node_modules", "dev.bat", "bin", ".env"];

const parseDate = () => {
	const d = new Date();
	const year = d.getFullYear();
	const month = d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1;
	const day = d.getDay() < 10 ? `0${d.getDay()}` : d.getDay();
	const hours = d.getHours() < 10 ? `0${d.getHours()}` : d.getHours();
	const minutes = d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes();
	const seconds = d.getSeconds() < 10 ? `0${d.getSeconds()}` : d.getSeconds();
	return year.toString() + month.toString() + day.toString() + hours.toString() + minutes.toString() + seconds.toString();
};

const backup: DiscordCommand = {
	conf: {
		aliases: ["yedekle", "yedek-al", "yedekal", "backup-al", "backupal"],
		permLevel: "GAMER",
		category: "Admin",
	},

	help: {
		name: "backup",
		description: "Botun bir yedeğini alır.",
		usage: "backup",
	},

	slashCommand: () => new SlashCommandBuilder(),

	async execute({ message, emojis, unicode }) {
		const backupMsgFirst = await message.reply(`${emojis.success} ${unicode.bullet} Yedekleme prosedürleri başlatılıyor...`);
		const totalItems = fs.readdirSync("./").filter(file => !ignoredItems.includes(file));
		const totalItemsSize = totalItems.reduce((acc, file) => acc + fs.statSync(file).size, 0);
		await message.channel.send(
			stripIndents`
            ${emojis.success} ${unicode.bullet} Yedekleme prosedürleri başlatıldı.
            ${emojis.info} ${unicode.bullet} Bu dizinde toplam **${totalItems.filter(file => fs.statSync(file).isFile()).length}** dosya bulundu.
            ${emojis.info} ${unicode.bullet} Bu dizinde toplam **${totalItems.filter(file => fs.statSync(file).isDirectory()).length}** klasör bulundu.
            ${emojis.info} ${unicode.bullet} Bu yedekleme için **${totalItemsSize}** bayt kullanılacak.
            `
		);
		try {
			if (!fs.existsSync("./backups")) fs.mkdirSync("./backups");
			zipper.addLocalFolder("./", null, name => !ignoredItems.includes(name) && !ignoredItems.some(file => name.startsWith(file)));
			zipper.addZipComment(`Yedekleme tarihi: ${parseDate()}\nYedekleme kanalı: ${(message.channel as TextChannel).name}\nYedekleme yapan: ${message.author.tag}`);
			zipper.writeZip(path.join(__dirname, "backups", `backup_${parseDate()}.zip`));
		} catch (err) {
			return backupMsgFirst.reply(`${emojis.error} ${unicode.bullet} Yedekleme sırasında bir hata oluştu.\n\`\`\`js\n${err}\`\`\``);
		}
		backupMsgFirst.reply(`${emojis.success} ${unicode.bullet} Yedekleme başarıyla tamamlandı.\n${emojis.info} ${unicode.bullet} Yedekleme dosyası **${path.join("backups", `backup_${parseDate()}.zip`)}** olarak kaydedildi.`);
	},
};

export default backup;
