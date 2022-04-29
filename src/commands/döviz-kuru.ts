import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed, Permissions } from "discord.js";
import axios from "axios";
import { DiscordCommand } from "../types";

const dovizKuru: DiscordCommand = {
	conf: {
		aliases: ["döviz"],
		permLevel: Permissions.DEFAULT,
		category: "Genel"
	},

	help: {
		name: "döviz-kuru",
		description: "Döviz kurlarını gösterir.",
		usage: "döviz-kuru"
	},

	slashCommand: () => new SlashCommandBuilder(),

	async execute({ client, message, emojis, unicode }) {
		const catchEvent = (err: any) => {
			message.reply(`${emojis.error} ${unicode.bullet} Kur bilgileri alınamadı\n\`\`\`js\n${err}\`\`\``);
		};
		const fetchCurrency = await message.channel.send("Döviz kurları çekiliyor...");
		const currencyReq: any = await axios.get("https://api.genelpara.com/embed/doviz.json").catch(catchEvent);
		if (!currencyReq?.data) return message.reply(`${emojis.error} ${unicode.bullet} Kur bilgileri alınamadı.`);
		const currencyData = currencyReq.data;
		const fetchCrypto = await message.channel.send("Kripto paraları çekiliyor...");
		const cryptoReq: any = await axios.get("https://api.genelpara.com/embed/kripto.json").catch(catchEvent);
		if (!cryptoReq?.data) return message.reply(`${emojis.error} ${unicode.bullet} Kur bilgileri alınamadı.`);
		const cryptoData = cryptoReq.data;
		const parse = (crypto: boolean, currency: string) => {
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
			.setAuthor({ name: message.author.username, iconURL: message.author.avatarURL() })
			.addField("💲 Döviz", "Döviz kurları")
			.addField("💵 Dolar (USD)", `➡️ Satış Fiyatı: **${parse(false, "USD").satis}** TL\n⬅️ Alış Fiyatı: **${parse(false, "USD").alis}** TL\nDeğişim: **${parse(false, "USD").degisim}**`, true)
			.addField("💶 Euro (EUR)", `➡️ Satış Fiyatı: **${parse(false, "EUR").satis}** TL\n⬅️ Alış Fiyatı: **${parse(false, "EUR").alis}** TL\nDeğişim: **${parse(false, "EUR").degisim}**`, true)
			.addField("💷 Sterlin (GBP)", `➡️ Satış Fiyatı: **${parse(false, "GBP").satis}** TL\n⬅️ Alış Fiyatı: **${parse(false, "GBP").alis}** TL\nDeğişim: **${parse(false, "GBP").degisim}**`, true)
			.addField("📁 Kaynak:", "https://api.genelpara.com/embed/doviz.json")
			.addField("🪙 Kripto", "Kripto paraları")
			.addField("🪙 Bitcoin (BTC)", `➡️ Satış Fiyatı: **${parse(true, "BTC").satis}** TL\n⬅️ Alış Fiyatı: **${parse(true, "BTC").alis}** TL\nDeğişim: **${parse(true, "BTC").degisim}**`, true)
			.addField("🪙 Ethereum (ETH)", `➡️ Satış Fiyatı: **${parse(true, "ETH").satis}** TL\n⬅️ Alış Fiyatı: **${parse(true, "ETH").alis}** TL\nDeğişim: **${parse(true, "ETH").degisim}**`, true)
			.addField("🪙 Litecoin (LTC)", `➡️ Satış Fiyatı: **${parse(true, "LTC").satis}** TL\n⬅️ Alış Fiyatı: **${parse(true, "LTC").alis}** TL\nDeğişim: **${parse(true, "LTC").degisim}**`, true)
			.addField("📁 Kaynak:", "https://api.genelpara.com/embed/kripto.json");
		fetchCurrency.delete();
		fetchCrypto.delete();
		message.reply({ embeds: [embed], ephemeral: true });
	}
};

export default dovizKuru;
