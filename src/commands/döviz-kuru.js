const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { get } = require("axios").default;

module.exports = {
	conf: {
		aliases: ["döviz"],
		permLevel: 0,
		category: "Genel",
	},

	help: {
		name: "döviz-kuru",
		description: "Döviz kurlarını gösterir.",
		usage: "döviz-kuru",
	},

	slashCommand: () => new SlashCommandBuilder(),

	async execute({ client, message, isSlash, emojis, unicode }) {
		const author = isSlash ? message.user : message.author;
		const catchEvent = err => {
			message.reply(`${emojis.error} ${unicode.bullet} Kur bilgileri alınamadı\n\`\`\`js\n${err}\`\`\``);
		};
		const fetchCurrency = await message.channel.send("Döviz kurları çekiliyor...");
		const currencyReq = await get("https://api.genelpara.com/embed/doviz.json").catch(catchEvent);
		if (!currencyReq?.data) return message.reply(`${emojis.error} ${unicode.bullet} Kur bilgileri alınamadı.`);
		const currencyData = currencyReq.data;
		const fetchCrypto = await message.channel.send("Kripto paraları çekiliyor...");
		const cryptoReq = await get("https://api.genelpara.com/embed/kripto.json").catch(catchEvent);
		if (!cryptoReq?.data) return message.reply(`${emojis.error} ${unicode.bullet} Kur bilgileri alınamadı.`);
		const cryptoData = cryptoReq.data;
		const parse = (crypto, currency) => {
			let data = currencyData[currency];
			if (crypto) data = cryptoData[currency];
			data.satis = data.satis?.replace?.(/(.*)<\/a>/g, "");
			return data;
		};
		const embed = new MessageEmbed()
			.setColor("RANDOM")
			.setTitle("Döviz / Kripto")
			.setFooter({ text: `${client.user.username} - Döviz Kuru Sistemi`, iconURL: client.user.avatarURL() })
			.setTimestamp()
			.setAuthor({ name: author.username, iconURL: author.avatarURL() })
			.addField("💲 Döviz", "Döviz kurları")
			.addField("💵 Dolar (USD)", `➡️ Satış Fiyatı: **${parse(0, "USD").satis}** TL\n⬅️ Alış Fiyatı: **${parse(0, "USD").alis}** TL\nDeğişim: **${parse(0, "USD").degisim}**`, true)
			.addField("💶 Euro (EUR)", `➡️ Satış Fiyatı: **${parse(0, "EUR").satis}** TL\n⬅️ Alış Fiyatı: **${parse(0, "EUR").alis}** TL\nDeğişim: **${parse(0, "EUR").degisim}**`, true)
			.addField("💷 Sterlin (GBP)", `➡️ Satış Fiyatı: **${parse(0, "GBP").satis}** TL\n⬅️ Alış Fiyatı: **${parse(0, "GBP").alis}** TL\nDeğişim: **${parse(0, "GBP").degisim}**`, true)
			.addField("📁 Kaynak:", "https://api.genelpara.com/embed/doviz.json")
			.addField("🪙 Kripto", "Kripto paraları")
			.addField("🪙 Bitcoin (BTC)", `➡️ Satış Fiyatı: **${parse(1, "BTC").satis}** TL\n⬅️ Alış Fiyatı: **${parse(1, "BTC").alis}** TL\nDeğişim: **${parse(1, "BTC").degisim}**`, true)
			.addField("🪙 Ethereum (ETH)", `➡️ Satış Fiyatı: **${parse(1, "ETH").satis}** TL\n⬅️ Alış Fiyatı: **${parse(1, "ETH").alis}** TL\nDeğişim: **${parse(1, "ETH").degisim}**`, true)
			.addField("🪙 Litecoin (LTC)", `➡️ Satış Fiyatı: **${parse(1, "LTC").satis}** TL\n⬅️ Alış Fiyatı: **${parse(1, "LTC").alis}** TL\nDeğişim: **${parse(1, "LTC").degisim}**`, true)
			.addField("📁 Kaynak:", "https://api.genelpara.com/embed/kripto.json");
		fetchCurrency.delete();
		fetchCrypto.delete();
		message.reply({ embeds: [embed], ephemeral: true });
	},
};
