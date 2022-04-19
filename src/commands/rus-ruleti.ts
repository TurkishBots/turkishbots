import { SlashCommandBuilder } from "@discordjs/builders";
import { User } from "discord.js";
import { DiscordCommand } from "../types";
import { sleep } from "../util/Functions";
const { randomRange } = require("../util/Util").default;

const rusRuleti: DiscordCommand = {
	conf: {
		aliases: ["rusruleti"],
		permLevel: 0,
		category: "Eğlence",
	},

	help: {
		name: "rus-ruleti",
		description: "Rus ruleti oynarsınız.",
		usage: "rus-ruleti [@kullanıcı]",
	},

	slashCommand: () => new SlashCommandBuilder().addUserOption(option => option.setName("kullanıcı").setDescription("Ruleti oynanacak kullanıcı").setRequired(false)),

	async execute({ message, args, emojis, unicode, isSlash }) {
		let opponent = isSlash ? args[0]?.["value"] : args[0];
		if (opponent) if (opponent.id === message.author.id) return message.reply(`${emojis.error} ${unicode.bullet} Kendin ile oynayamazsın!`);
		let isBot = false;
		if (!opponent) isBot = true;
		const msg = await message.reply("🔫 Silah dolduruluyor...");
		await sleep(2000);
		const gunBullet = randomRange(1, 8);
		let isUserTurn: boolean = true;
		let gameOver: boolean = false;
		let currentBullet: number = 0;
		let winner: User;
		while (!gameOver) {
			++currentBullet;
			if (isUserTurn) {
				await sleep(2000);
				await msg.edit(`🔫 ${message.author} tetiği çekti.`);
				await sleep(2000);
				if (currentBullet <= gunBullet) {
					await msg.edit(`🚬🔫 ${message.author} kurtuldu! şimdilik...`);
					isUserTurn = false;
				} else {
					await msg.edit(`🔥🔫 ${message.author} patladı!`);
					winner = opponent ?? "Bot";
					gameOver = true;
				}
			} else {
				await sleep(2000);
				await msg.edit(`🔫 ${isBot ? "Bot" : `${opponent}`} tetiği çekti.`);
				await sleep(2000);
				if (currentBullet <= gunBullet) {
					await msg.edit(`🚬🔫 ${isBot ? "Bot" : `${opponent}`} kurtuldu! şimdilik...`);
					isUserTurn = true;
				} else {
					await msg.edit(`🔥🔫 ${isBot ? "Bot" : `${opponent}`} patladı!`);
					winner = message.author;
					gameOver = true;
				}
			}
		}
		await sleep(2000);
		msg.edit(`🔫 Kazanan : **${winner}**!`);
	},
};

export default rusRuleti;
