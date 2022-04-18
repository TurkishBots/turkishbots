import { SlashCommandBuilder } from "@discordjs/builders";
import { TextChannel } from "discord.js";
import { DiscordCommand } from "../types";

const kilitAc: DiscordCommand = {
	conf: {
		aliases: ["kilitaç", "unlock", "kanal-kilit-aç", "kanalkilitaç"],
		permLevel: "MANAGE_CHANNELS",
		category: "Moderasyon",
		guildOnly: true,
	},

	help: {
		name: "kilit-aç",
		description: "Komutu kullandığınız kanaldaki kilidi açar.",
		usage: "kilit-aç",
	},

	slashCommand: () => new SlashCommandBuilder(),

	execute({ client, message, emojis, unicode }) {
		if (!client.lockit) client.lockit = {};
		if (!client.lockit[message.channel.id]) return message.reply({ content: `${emojis.error} ${unicode.bullet} Bu kanalın zaten kilidi açık.`, ephemeral: true });
		(message.channel as TextChannel).permissionOverwrites.edit(message.guild.id, { SEND_MESSAGES: null }).then(() => {
			delete client.lockit[message.channel.id];
			message.reply({ content: "🔓 Kanalın kilidi açıldı.", ephemeral: true }).catch(error => {
				message.reply({ content: `${emojis.error} ${unicode.bullet} Bir hata oluştu!\n\`\`\`js\n${error}\`\`\``, ephemeral: true });
				console.error(error);
			});
		});
	},
};

export default kilitAc;
