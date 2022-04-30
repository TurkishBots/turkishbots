//! Imports
import { Client, Intents, MessageEmbed, WebhookClient, Collection, Permissions, TextChannel } from "discord.js";
import config from "./config";
import path from "node:path";
import moment from "moment";
import chalk from "chalk";
import fs from "node:fs";
//! Types
import { JsonDatabase } from "wio.db";
import { DiscordCommand } from "./types";
//? End Types
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import AntiSpam from "discord-anti-spam";
import { GiveawaysManager } from "discord-giveaways";
//? End Imports
const client = new Client({
	partials: ["CHANNEL"],
	intents: [Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_WEBHOOKS, Intents.FLAGS.GUILD_PRESENCES]
});
client.config = config;
const { prefix, token, webhooks } = config;
const db: JsonDatabase<any> = require("./components/database")();
//! Slash Command
const rest = new REST({ version: "9" }).setToken(token);
//! Event Loader
require("./components/eventLoader")(client);
//! Web
require("./web")(client);
//! Antispam
// @ts-ignore
const antiSpam = new AntiSpam({
	warnThreshold: 5,
	muteThreshold: 7,
	kickThreshold: 9,
	banThreshold: 9,
	maxInterval: 2000,
	warnMessage: "Hey {@user}, lütfen art arda fazla mesaj atmayı bırak.",
	muteMessage: "**{user_tag}** art arda fazla mesaj attığı için susturuldu.",
	kickMessage: "**{user_tag}** art arda fazla mesaj attığı için sunucudan atıldı.",
	banMessage: "**{user_tag}** art arda fazla mesaj attığı için sunucudan yasaklandı.",
	muteErrorMessage: "**{user_tag}** kullanıcısın susturulamadı çünkü bota gerekli yetki verilmedi.",
	kickErrorMessage: "**{user_tag}** kullanıcısı sunucudan atılamadı çünkü bota gerekli yetki verilmedi.",
	banErrorMessage: "**{user_tag}** kullanıcısı sunucudan yasaklanamadı çünkü bota gerekli yetki verilmedi.",
	maxDuplicatesWarning: 6,
	maxDuplicatesKick: 10,
	maxDuplicatesBan: 12,
	maxDuplicatesMute: 8,
	ignoredPermissions: ["ADMINISTRATOR", "MANAGE_GUILD"],
	ignoredRoles: ["937077467242455093", "937077382634950676", "906667332833792051", "947546168949370921"],
	ignoreBots: true,
	verbose: true,
	unMuteTime: 10,
	removeMessages: false
});
client.antiSpam = antiSpam;
//! Giveways
client.giveawaysManager = new GiveawaysManager(client, {
	storage: "./databases/giveaways.json",
	default: {
		botsCanWin: false,
		embedColor: "#FF0000",
		embedColorEnd: "#000000",
		reaction: "🎉"
	}
});
client.giveawaysManager["messages"] = {
	raw: {
		giveaway: "@everyone\n🎉🎉  **ÇEKİLİŞ**  🎉🎉",
		giveawayEnded: "🎉🎉  **ÇEKİLİŞ SONA ERDİ**  🎉🎉",
		drawing: "⏱️ Bitiş tarihi: {timestamp}",
		dropMessage: "🎉 İle ilk tepki veren siz olun!",
		inviteToParticipate: "Katılmak için 🎉 ile tepki verin!",
		winMessage: "🎉 Tebrikler, {winners}! **{this.prize}** kazandınız!",
		embedFooter: "{this.winnerCount} {this.winnerCount > 1 ? 'kazananlar' : 'kazanan'}",
		noWinner: "Çekiliş iptal edildi, geçerli katılımcı yok.",
		hostedBy: "Sahip: {this.hostedBy}",
		winners: "{this.winnerCount > 1 ? 'Kazananlar' : 'Kazanan'}:",
		endedAt: "Sona erme tarihi"
	},
	reroll: {
		congrat: "🎉 Yeni {this.winnerCount > 1 ? 'kazananlar' : 'kazanan'}: {winners}! Tebrikler, **{this.prize}** kazandınız!",
		error: "Geçerli katılımcı yok, yeni {this.winnerCount > 1 ? 'kazananlar' : 'kazanan'} seçilemez!"
	}
};
//! WebHook
const BotLog = new WebhookClient({ id: webhooks.log.id, token: webhooks.log.token });
const botStatus = config.status === "dnd" ? "Rahatsız Etmeyin" : config.status === "idle" ? "Boşta" : config.status === "offline" ? "Çevrimdışı" : "Çevrimiçi";
const botStatusColored = botStatus === "Boşta" ? chalk.yellowBright(botStatus) : botStatus === "Çevrimiçi" ? chalk.greenBright(botStatus) : botStatus === "Rahatsız Etmeyin" ? chalk.redBright(botStatus) : botStatus === "Çevrimdışı" ? chalk.gray(botStatus) : botStatus;
const log = (...message: string[]) => console.log(chalk.yellow(`[${moment().format("YYYY-MM-DD HH:mm:ss")}]`), ...message);

//! Load Commands
client.commands = new Collection();
client.slashCommands = new Collection();
client.aliases = new Collection();
fs.readdir(path.join(__dirname, "commands"), (err, files) => {
	if (err) return console.error(err);
	log(chalk.cyanBright`Yüklenicek {bold ${files.length}} komut var.`);
	BotLog.send(`**[Komut]** Yüklenicek **${files.length}** adet komut var.`);
	files.forEach(f => {
		const props: DiscordCommand = require(`./commands/${f}`).default;
		if (!props.help) return log(chalk.redBright`{bold ${f}} dosyası için yardım bilgisi eksik.`);
		if (!props.conf) return log(chalk.redBright`{bold ${f}} dosyası için konfigürasyon bilgisi eksik.`);
		if (props.conf.disabled === true) return;
		const slashCommand = props?.slashCommand?.(client);
		if (slashCommand) client.slashCommands.set(props.help.name, slashCommand.setName(slashCommand?.name ?? props.help.name).setDescription(props.help.description));
		log(chalk.greenBright`Yüklenen komut {bold ${props.help.name}}.`);
		BotLog.send(`**[Komut]** Yüklenen komut **${props.help.name}**.`);
		client.commands.set(props.help.name, props);
		props.conf.aliases.forEach(alias => client.aliases.set(alias, props.help.name));
	});
});
client.reload = {
	command: (command: string) =>
		new Promise<void>((resolve, reject) => {
			try {
				delete require.cache[require.resolve(path.join(__dirname, "commands", command))];
				const cmd: DiscordCommand = require(path.join(__dirname, "commands", command));
				client.commands.delete(command);
				client.aliases.forEach((c: string, a: any) => (c === command ? client.aliases.delete(a) : null));
				client.commands.set(command, cmd);
				cmd.conf.aliases.forEach(alias => client.aliases.set(alias, cmd.help.name));
				resolve();
			} catch (e) {
				reject(e);
			}
		})
};
client.load = {
	command: (command: string) =>
		new Promise<void>((resolve, reject) => {
			try {
				const cmd = require(path.join(__dirname, "commands", command));
				client.commands.set(command, cmd);
				cmd.conf.aliases.forEach((a: any) => client.aliases.set(a, cmd.help.name));
				resolve();
			} catch (e) {
				reject(e);
			}
		})
};
client.unload = {
	command: (command: string) =>
		new Promise<void>((resolve, reject) => {
			try {
				delete require.cache[require.resolve(path.join(__dirname, "commands", command))];
				client.commands.delete(command);
				client.aliases.forEach((c: string, a: any) => (c === command ? client.aliases.delete(a) : null));
				resolve();
			} catch (e) {
				reject(e);
			}
		})
};
//? End

client.once("ready", () => {
	rest
		.put(Routes.applicationCommands(client.user.id), { body: client.slashCommands })
		.then(() => {
			log(chalk.greenBright("Slash komutları yüklendi."));
			BotLog.send(`**[Slash]** Slash komutları **yüklendi**.`);
		})
		.catch(console.error);
	//! Log
	console.log(chalk.blueBright("_________________________________________"));
	console.log(chalk.yellowBright`Bot Adı               : {white ${client.user.username}}`);
	console.log(chalk.yellowBright`Sunucular             : {white ${client.guilds.cache.size}}`);
	console.log(chalk.yellowBright`Kullanıcılar          : {white ${client.users.cache.size}}`);
	console.log(chalk.yellowBright`Prefix                : {white ${prefix}}`);
	console.log(chalk.yellowBright`Shard                 : {white ${client.shard ? client.shard.ids.length + 1 + "/" + client.shard.count : chalk.yellow("Debug")}}`);
	console.log(chalk.yellowBright`Zaman                 : {white ${moment().format("YYYY-MM-DD HH:mm:ss")}}`);
	console.log(chalk.yellowBright`Bot Durum             : {white ${botStatusColored}}`);
	console.log(chalk.yellowBright`Durum                 : ${client.shard ? (client.shard.ids.length + 1 < client.shard.count ? chalk.cyanBright("Shardlar Yükleniyor...") : chalk.greenBright("Hazır")) : chalk.yellow("Debug")}`);
	console.log(chalk.blueBright("_________________________________________"));
	//? End
	//! WebHook
	BotLog.send("**[Hazır]** Bot **hazır**.");

	//! Activity
	require("./components/setActivity")(client);

	if (typeof db.get("restart") === "string") (client.guilds.cache.get(config.guild).channels.cache.get(db.get("restart")) as TextChannel).send(`${config.emojis.success} ${config.unicodes.bullet} Bot yeniden başlatıldı!`);
	db.delete("restart");
});

client.on("messageCreate", async message => {
	antiSpam.message(message);
	if (message.author.bot) return;
	if (message.channel.type === "DM") return;
	//! Get Prefix
	if (message.content === `<@!${client.user.id}>` || message.content === `<@${client.user.id}>`) message.reply(`Şuanki Prefixim : \`${prefix}\``).then(m => setTimeout(() => m?.delete?.(), config.deleteInterval));
	//! AFK
	if (message.mentions.users.find(u => db.get(`afks_${u.id}`)) && !db.get(`afks_${message.author.id}`)) {
		const user = message.mentions.users.find(u => db.get(`afks_${u.id}`));
		message.reply(`${user.username} Şuanda AFK !`).then(m => setTimeout(() => m?.delete?.(), config.deleteInterval));
		const embed = new MessageEmbed();
		embed.setColor("RANDOM");
		embed.setAuthor({ name: message.author.username, iconURL: message.author.avatarURL() });
		embed.setFooter({ text: `${client.user.username} AFK Sistemi`, iconURL: client.user.avatarURL() });
		embed.setTimestamp();
		embed.setTitle(`${message.author.username} adlı kullanıcıdan bir mesajın var !`);
		embed.setURL(message.url);
		embed.setDescription(message.content);
		client.users.cache
			.find(u => u.id === user.id)
			.send({ embeds: [embed] })
			.catch(() => {});
	}
	if (db.exists(`afks_${message.author.id}`) && db.get(`afks_${message.author.id}`).time + 100 < Date.now()) {
		db.delete(`afks_${message.author.id}`);
		message.reply(`${message.author} artık AFK değil !`).then(m => setTimeout(() => m?.delete?.(), config.deleteInterval));
	}
	//! Block Ad
	if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES) && message.content.match(/(\b(?:https?|ftp|hetepese):\/\/[a-z0-9-+&@#/%?=~_|!:,.;]*[a-z0-9-+&@#/%=~_|]|(discord)?\.gg\/(.*))/gim)) {
		message.delete().catch(() => {});
		message.channel.send(`${config.emojis.error} ${config.unicodes.bullet} ${message.author} Bu kanalda reklam yapamazsın!`).then(m => setTimeout(() => m.delete(), config.deleteInterval));
	}
	//! Eğlence
	if (message.content === "31") message.reply("<:sj:841658987438276608>");
	if (message.content === ":goat:" || message.content === "🐐") message.reply("got yazıo");
	if (message.content.toLowerCase() === "baw çiki baw baw") message.reply({ stickers: ["934592126950469722"] }).catch(_ => message.reply({ files: ["https://media.discordapp.net/stickers/934592126950469722.webp?size=160"] }));
	if (message.content.toLowerCase().startsWith("günaydın")) message.reply("Günaydın adamım");
	if (message.content.toLowerCase().startsWith("iyi geceler") || message.content.toLowerCase().startsWith("ig ")) message.reply("İyi geceler tatlı rüyalar reis");
});

client.on("messageUpdate", async (oldMessage, newMessage) => {
	if (newMessage.author.bot || newMessage.channel.type === "DM" || !newMessage.guild) return;
	if (!newMessage.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES) && newMessage.content.match(/\b(?:https?|ftp|hetepese):\/\/[a-z0-9-+&@#/%?=~_|!:,.;]*[a-z0-9-+&@#/%=~_|]/gim)) {
		oldMessage.delete().catch(() => {});
		newMessage.channel.send(`${config.emojis.error} ${config.unicodes.bullet} ${newMessage.author} Ben akıllı bir botum kanka.`).then(m => setTimeout(() => m?.delete?.(), config.deleteInterval));
	}
});

client.on("guildCreate", guild => {
	//! Leave
	if (!guild.members.cache.find(u => config.owners.includes(u.id))) guild.fetchOwner().then(o => o.send(`**${guild.name}** adlı sunucudan çıkıyorum çünkü sadece **TurkishMethods** sunucusuna özel bir botum!`).then(_ => guild.leave()));
});

//! Rate
client.on("rateLimit", info => {
	BotLog.send(`**[RateLimit]** Bot rate limit yedi!\n\`\`\`json\n${JSON.stringify(info, null, 2)}\`\`\``);
	setTimeout(() => BotLog.send("**[RateLimit]** Rate limit süresi sona erdi."), info.timeout);
});

//! Restart
client.restart = async (id?: string) => {
	await BotLog.send(`**[Bot]** Bot yeniden başlatılıyor...`);
	db.set("restart", id ?? true);
	client.destroy();
	process.exit(0);
};

//* Listening errors & warns
client.on("error", console.error);
client.on("warn", console.warn);
process.on("warning", console.warn);

client.login(token); //! Login Bot
