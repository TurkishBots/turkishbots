import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed, Permissions } from "discord.js";
import { DiscordCommand } from "../types";
import axios from "axios";

const kodCalistir: DiscordCommand = {
	conf: {
		aliases: ["kodçalıştır"],
		permLevel: Permissions.DEFAULT,
		category: "Genel",
		guildOnly: false
	},

	help: {
		name: "kod-çalıştır",
		description: "NodeJS dilinde bir kod çalıştırır.",
		usage: "kod-çalıştır <kod>"
	},

	slashCommand: () => new SlashCommandBuilder().addStringOption(option => option.setName("kod").setDescription("Çalıştırılacak kod").setRequired(true)),

	async execute({ message, args, emojis, unicode, isSlash }) {
		// @ts-ignore
		args[0] = isSlash ? args[0]["value"].trim() : args[0]?.trim?.();
		if (!args[0]) return message.reply({ content: `${emojis.error} ${unicode.bullet} Lütfen çalıştırmak istediğiniz kodu girin!`, ephemeral: true });
		const code = args
			.join(" ")
			.replaceAll(/```(js)?/gim, "")
			.trim();
		if (!isSlash) await message.react(emojis.compile_dots).catch(() => {});
		const req: any = await axios
			.post("https://wandbox.org/api/compile.ndjson", JSON.stringify({ compiler: "nodejs-16.14.0", title: "", description: "", code, codes: [], options: "", stdin: "", "compiler-option-raw": "", "runtime-option-raw": "" }), { headers: { "Content-Type": "application/json" } })
			.catch(err => message.reply({ content: `${emojis.error} ${unicode.bullet} Kod çalıştırma sırasında bir hata oluştu!\n\`\`\`${err}\`\`\``, ephemeral: true }));
		const res = req.data.split("\n").map((s: any) => s && JSON.parse(s));
		const err = res.find((r: any) => r.type === "StdErr")?.data;
		const out = res.find((r: any) => r.type === "StdOut")?.data;
		if (!isSlash) {
			await message.reactions.cache
				.get(emojis.compile_dots.match(/<a?:.*:(.*?)>/)[1])
				.remove()
				.catch(() => {});
		}
		const embed = new MessageEmbed()
			.setColor(err ? "RED" : "BLUE")
			.setTitle(!err && !out ? "Çalıştırma başarılı" : "Program Çıktısı")
			.setDescription(out || err ? `\`\`\`js\n${(out || err).slice(0, 250)}\`\`\`` : "Çıktı yok.")
			.setFooter({ text: `${message.author.tag} | wandbox.org` });
		const msg = await message.reply({ embeds: [embed], ephemeral: true }).catch(() => {});
		if (msg && !isSlash) msg.react(err ? emojis.error : emojis.success).catch(() => {});
	}
};

export default kodCalistir;
