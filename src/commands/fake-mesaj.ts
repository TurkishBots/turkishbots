import { SlashCommandBuilder } from "@discordjs/builders";
import { TextChannel, WebhookClient, Permissions } from "discord.js";
import { DiscordCommand } from "../types";

const fakeMesaj: DiscordCommand = {
	conf: {
		aliases: ["fakemesaj", "sahte-mesaj", "sahtemesaj"],
		permLevel: Permissions.FLAGS.MODERATE_MEMBERS,
		category: "Moderasyon",
		guildOnly: true
	},

	help: {
		name: "fake-mesaj",
		description: "Birine mesaj yazdırır.",
		usage: "fake-mesaj <@kullanıcı> <mesaj>"
	},

	slashCommand: () => new SlashCommandBuilder().addUserOption(option => option.setName("kullanıcı").setDescription("Mesajın atılacağı kullanıcı").setRequired(true)).addStringOption(option => option.setName("mesaj").setDescription("Mesajın içeriği").setRequired(true)),

	execute({ client, message, args, emojis, unicode, isSlash }) {
		const msg = isSlash ? args[1]["value"].trim() : args.slice(1).join(" ").trim();
		const user = isSlash ? message.guild.members.cache.get(args[0]["value"])?.user : message.mentions.users.first();
		const nickname = isSlash ? message.guild.members.cache.get(args[0]["value"])?.nickname : message.guild.members.cache.get(message.mentions.users.first()?.id)?.nickname;
		if (!user) return message.reply(`${emojis.error} Lütfen bir kullanıcı etiketleyin.`);
		if (!msg) return message.reply(`${emojis.error} ${unicode.bullet} Lütfen bir mesaj girin.`);
		if (user.id === message.author.id) return message.reply({ content: `${emojis.error} ${unicode.bullet} Kendine mesaj yazdıramazsın!`, ephemeral: true });
		if (user.id === client.user.id) return message.reply({ content: `${emojis.error} ${unicode.bullet} Bana mesaj yazdıramazsın!`, ephemeral: true });
		if (msg.length > 2000) return message.reply({ content: `${emojis.error} ${unicode.bullet} Mesajın çok uzun!`, ephemeral: true });
		if (msg.includes("@everyone")) return message.reply({ content: `${emojis.error} ${unicode.bullet} \`@everyone\` etiketi attıramazsın!`, ephemeral: true });
		if (msg.includes("@here")) return message.reply({ content: `${emojis.error} ${unicode.bullet} \`@here\` etiketi attıramazsın!`, ephemeral: true });
		try {
			if (!isSlash) message.delete();
			(message.channel as TextChannel).createWebhook(nickname ?? user.username, { avatar: user.displayAvatarURL({ format: "png", size: 4096 }) }).then(async webhook => {
				const webhookClient = new WebhookClient({ id: webhook.id, token: webhook.token });
				await webhookClient.send(msg);
				webhook.delete();
				if (isSlash) message.reply({ content: `${emojis.success} ${unicode.bullet} Mesajınız gönderildi.`, ephemeral: true });
			});
		} catch (err) {
			message.reply({ content: `${emojis.error} ${unicode.bullet} Bir hata oluştu!\n\`\`\`js\n${err}\`\`\``, ephemeral: true });
		}
	}
};

export default fakeMesaj;
