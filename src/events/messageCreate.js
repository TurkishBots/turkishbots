const { Permissions } = require("discord.js");
const talkedRecently = {};

const formatTime = time => {
	time = time.toString();
	if (time.length < 4) return "0." + time.slice(0, 2);
	return time.slice(0, 1) + "." + time.slice(1, 3);
};

const formatPerm = perm => {
	const perms = new Permissions(typeof perm === "string" ? Permissions.FLAGS[perm] : perm);
	if (perms.has("ADMINISTRATOR")) return "Yönetici";
	if (perms.has("MANAGE_GUILD")) return "Sunucuyu Yönet";
	if (perms.has("MANAGE_ROLES")) return "Rolleri Yönet";
	if (perms.has("MANAGE_CHANNELS")) return "Kanalları Yönet";
	if (perms.has("KICK_MEMBERS")) return "Üyeleri At";
	if (perms.has("BAN_MEMBERS")) return "Üyeleri Yasakla";
	if (perms.has("DEAFEN_MEMBERS")) return "Üyeleri Sağırlaştır";
	if (perms.has("MOVE_MEMBERS")) return "Üyeleri Taşı";
	if (perms.has("MANAGE_EVENTS")) return "Etkinlikleri Yönet";
	if (perms.has("MANAGE_THREADS")) return "Konuları Yönet";
	if (perms.has("MENTION_EVERYONE")) return "Herkesi Etiketle";
	if (perms.has("MODERATE_MEMBERS")) return "Üyeleri Yönet";
	if (perms.has("MUTE_MEMBERS")) return "Üyeleri Sustur";
	if (perms.has("MANAGE_NICKNAMES")) return "Takma Adları Yönet";
	if (perms.has("MANAGE_EMOJIS_AND_STICKERS")) return "Emojileri ve Stickerleri Yönet";
	if (perms.has("MANAGE_WEBHOOKS")) return "Webhookları Yönet";
	if (perms.has("MANAGE_MESSAGES")) return "Mesajları Yönet";
	return "Bilinmeyen";
};

module.exports = message => {
	if (message.author.bot) return;
	const client = message.client;
	const { config } = client;

	if (!message.content.startsWith(config.prefix) || message.content === config.prefix) return;
	const command = message.content.split(" ")[0].slice(config.prefix.length);
	const params = message.content.split(" ").slice(1);
	const unicodechars = config.unicodes;

	let cmd;
	if (client.commands.has(command)) cmd = client.commands.get(command);
	else if (client.aliases.has(command)) cmd = client.commands.get(client.aliases.get(command));
	if (!cmd || cmd.conf.enabled === false) return message.reply(`${config.emojis.error} ${unicodechars.bullet} Bilinmeyen komut! Komut listesi için \`${config.prefix}yardım\``).then(m => setTimeout(() => m?.delete?.(), config.deleteInterval));
	if (cmd.conf.guildOnly && (message.channel.type === "DM" || !message.guild)) return message.reply(`${config.emojis.error} ${unicodechars.bullet} Bu komutu sadece sunucu içinde kullanabilirsin!`).then(m => setTimeout(() => m?.delete?.(), config.deleteInterval));
	if (!config.owners.includes(message.author.id) && message.channel.type !== "DM" && message?.guild?.id === config.guild && cmd.conf.category === "Eğlence" && message?.channel?.id !== "938195606567010374") {
		return message.reply(`${config.emojis.error} ${unicodechars.bullet} Eğlence komutlarını sadece <#938195606567010374> kanalında kullanabilirsin!`).then(m => setTimeout(() => m?.delete?.(), config.deleteInterval));
	}

	const hasPerm = (permLevel, message) => {
		if (config.owners.includes(message.author.id) || !permLevel || message.member.permissions.has(Permissions.FLAGS[permLevel])) return true;
		else return false;
	};

	if (cmd.conf.permLevel === "OWNER" && !config.owners.includes(message.author.id)) return message.reply(`${config.emojis.error} ${unicodechars.bullet} Bu komutu sadece yöneticiler kullanabilir!`).then(m => setTimeout(() => m?.delete?.(), config.deleteInterval));
	if (cmd.conf.permLevel === "GAMER" && message.author.id !== "530043492014096384") return message.reply(`${config.emojis.error} ${unicodechars.bullet} Bu komutu sadece GamerboyTR kullanabilir!`).then(m => setTimeout(() => m?.delete?.(), config.deleteInterval));
	if (hasPerm(cmd.conf.permLevel, message)) {
		if (!config.owners.includes(message.author.id) && talkedRecently[message.author.id]) {
			return message.reply(`⏱ | ${message.author}! Lütfen **${formatTime(2500 - (Date.now() - talkedRecently[message.author.id]))}s** bekle ve tekrar dene!`).then(m => setTimeout(() => m?.delete?.(), config.deleteInterval));
		}
		talkedRecently[message.author.id] = Date.now();
		setTimeout(_ => delete talkedRecently[message.author.id], 2500);
		try {
			cmd.execute({ client, message, args: params, emojis: config.emojis, unicode: unicodechars, isOwner: config.owners.includes(message.author.id), isSlash: false });
		} catch (error) {
			console.error(error);
			message.reply(`${config.emojis.error} ${unicodechars.bullet} Komut çalıştırılırken beklenmedik bir hata meydana geldi!\n\`\`\`js\n${error}\`\`\``);
		}
	} else return message.reply(`${config.emojis.error} ${unicodechars.bullet} Bu komutu kullanmak için \`${formatPerm(cmd.conf.permLevel).toLocaleUpperCase("tr").replaceAll(" ", "_")}\` yetkisine sahip olman gerekli!`).then(m => setTimeout(() => m?.delete?.(), config.deleteInterval));
};
