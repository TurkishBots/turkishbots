const { Permissions } = require("discord.js");

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

module.exports = interaction => {
	if (!interaction.isCommand()) return;
	const client = interaction.client;
	const { config } = client;
	const { commandName } = interaction;
	if (interaction.user.bot) return;

	const params = interaction.options._hoistedOptions;
	const unicodechars = config.unicodes;
	const cmd = client.commands.get(commandName);
	if (cmd.conf.guildOnly && (interaction.channel.type === "DM" || !interaction.guild)) return interaction.reply({ content: `${config.emojis.error} ${unicodechars.bullet} Bu Slash komutunu sadece sunucu içinde kullanabilirsin!`, ephemeral: true });

	const hasPerm = (permLevel, int) => {
		if (config.owners.includes(int.user.id) || (permLevel === "GAMER" && int.user.id === "530043492014096384") || !permLevel || int.member.permissions.has(Permissions.FLAGS[permLevel])) return true;
		else return false;
	};

	if (hasPerm(cmd.conf.permLevel, interaction)) {
		try {
			cmd.execute({ client, message: interaction, args: params, emojis: config.emojis, unicode: unicodechars, isOwner: config.owners.includes(interaction.user.id), isSlash: true });
		} catch (e) {
			console.error(e);
			interaction.reply({ content: `${config.emojis.error} ${unicodechars.bullet} Slash komutu çalıştırılırken beklenmedik bir hata meydana geldi!\n\`\`\`js\n${e}\`\`\``, ephemeral: true });
		}
	} else if (cmd.conf.permLevel === "OWNER") return interaction.reply(`${config.emojis.error} ${unicodechars.bullet} Bu komutu sadece yöneticiler kullanabilir!`);
	else if (cmd.conf.permLevel === "GAMER") return interaction.reply({ content: `${config.emojis.error} ${unicodechars.bullet} Bu komutu sadece GamerboyTR kullanabilir!`, ephemeral: true });
	else return interaction.reply({ content: `${config.emojis.error} ${unicodechars.bullet} Bu komutu kullanmak için \`${formatPerm(cmd.conf.permLevel)}\` yetkisine sahip olman gerekli!`, ephemeral: true });
};
