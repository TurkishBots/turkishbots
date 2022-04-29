import { SlashCommandBuilder } from "@discordjs/builders";
import { User } from "discord.js";
import { DiscordCommand } from "../types";

const reboot: DiscordCommand = {
	conf: {
		aliases: ["yenile", "yb", "botreboot", "bot-reboot"],
		permLevel: "OWNER",
		category: "Admin"
	},

	help: {
		name: "reboot",
		description: "Botu yeniden başlatır.",
		usage: "reboot"
	},

	slashCommand: () => new SlashCommandBuilder(),

	async execute({ client, message, args, emojis, unicode, isSlash }) {
		if (isSlash || args[0] === "1") {
			message.reply({ content: `${emojis.success} ${unicode.bullet} Bot yeniden başlatılıyor...`, ephemeral: true });
			client.restart(message.channel.id);
			return;
		}
		const msg = await message.reply("Botun yeniden başlatılmasını istediğinize emin misiniz?");
		msg.react("940304315371884625");
		await msg.react("940304381356683356");
		const filter = (reaction: any, user: User) => ["940304315371884625", "940304381356683356"].includes(reaction.emoji.id) && user.id === message.author.id;
		msg
			.awaitReactions({ filter, max: 1, time: 30000, errors: ["time"] })
			.then(collected => {
				const reaction = collected.first();
				msg.reactions.removeAll().catch(() => {});

				if (reaction.emoji.id === "940304315371884625") {
					msg.edit(`${emojis.success} ${unicode.bullet} Bot yeniden başlatılıyor...`);
					client.restart(message.channel.id);
				} else if (reaction.emoji.id === "940304381356683356") msg.edit(`${emojis.error} ${unicode.bullet} Yeniden başlatma iptal edildi.`);
			})
			.catch(collected => {
				msg.reactions.removeAll().catch(() => {});
				if (!collected[0]) msg.reply(`${emojis.error} ${unicode.bullet} Yeniden başlatma iptal edildi.`);
			});
	}
};

export default reboot;
