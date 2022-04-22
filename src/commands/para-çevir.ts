import { SlashCommandBuilder } from "@discordjs/builders";
import { DiscordCommand } from "../types";
import { sleep } from "../util/Functions";

const paraCevir: DiscordCommand = {
	conf: {
		aliases: ["paraçevir"],
		permLevel: 0,
		category: "Eğlence",
	},

	help: {
		name: "para-çevir",
		description: "Yazı tura oyununu oynarsınız.",
		usage: "para-çevir [yazı|tura]",
	},

	slashCommand: () =>
		new SlashCommandBuilder().addStringOption(option =>
			option
				.setName("yüzü")
				.setDescription("Paranın yüzü (yazı/tura)")
				.setChoices([
					["yazı", "yazı"],
					["tura", "tura"],
				])
				.setRequired(false)
		),

	async execute({ message, args, isSlash }) {
		const coinFace = ["yazı", "tura"].includes(isSlash ? args[0]?.["value"] : args[0]) ? (isSlash ? args[0]?.["value"] : args[0]) : "yazı";
		const msg = await message.reply(`**${message.author.username}** 1 Türk Lirasını havaya attı ve **${coinFace}**yı seçti!`);
		sleep(2000);
		const isWin = Math.random() >= 0.5;
		msg.edit(`**${message.author.username}** 1 Türk Lirasını havaya attı ve **${coinFace}**yı seçti!\nPara elinde durdu veee **${!isWin ? (coinFace === "yazı" ? "tura" : "yazı") : coinFace}** geldi, **${isWin ? "kazandın" : "kaybettin"}**!`);
	},
};

export default paraCevir;
