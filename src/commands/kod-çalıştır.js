const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const axios = require("axios").default;

module.exports = {
	conf: {
		aliases: ["kodçalıştır"],
		permLevel: 0,
		category: "Genel",
		guildOnly: false,
	},

	help: {
		name: "kod-çalıştır",
		description: "NodeJS dilinde bir kod çalıştırır.",
		usage: "kod-çalıştır <kod>",
	},

	slashCommand: () => new SlashCommandBuilder().addStringOption(option => option.setName("kod").setDescription("Çalıştırılacak kod").setRequired(true)),

	async execute({ message, args, emojis, unicode, isSlash }) {
		const author = isSlash ? message.user : message.author;
		args[0] = isSlash ? args[0]?.value?.trim?.() : args[0]?.trim?.();
		if (!args[0]) return message.reply({ content: `${emojis.error} ${unicode.bullet} Lütfen çalıştırmak istediğiniz kodu girin!`, ephemeral: true });
		const code = args
			.join(" ")
			.replaceAll(/```(js)?/gim, "")
			.trim();
		if (!isSlash) await message.react(emojis.compile_dots).catch(() => {});
		const req = await axios
			.post("https://wandbox.org/api/compile.ndjson", JSON.stringify({ compiler: "nodejs-16.14.0", title: "", description: "", code, codes: [], options: "", stdin: "", "compiler-option-raw": "", "runtime-option-raw": "" }), { headers: { "Content-Type": "application/json" } })
			.catch(err => message.reply({ content: `${emojis.error} ${unicode.bullet} Kod çalıştırma sırasında bir hata oluştu!\n\`\`\`${err}\`\`\``, ephemeral: true }));
		const res = req.data.split("\n").map(s => s && JSON.parse(s));
		const err = res.find(r => r.type === "StdErr")?.data;
		const out = res.find(r => r.type === "StdOut")?.data;
		if (!isSlash) await message.reactions.cache.get(emojis.compile_dots.match(/<a?:.*:(.*?)>/)[1]).remove();
		const embed = new MessageEmbed()
			.setColor(err ? "RED" : "BLUE")
			.setTitle(!err && !out ? "Çalıştırma başarılı" : "Program Çıktısı")
			.setDescription(out || err ? `\`\`\`js\n${(out || err).slice(0, 250)}\`\`\`` : "Çıktı yok.")
			.setFooter({ text: `${author.tag} | wandbox.org` });
		const msg = await message.reply({ embeds: [embed], ephemeral: true }).catch(() => {});
		if (!isSlash) msg.react(err ? emojis.error : emojis.success).catch(() => {});
	},
};
