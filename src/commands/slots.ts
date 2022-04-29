import { SlashCommandBuilder } from "@discordjs/builders";
import { stripIndents } from "common-tags";
import { DiscordCommand } from "../types";
import { Permissions } from "discord.js";
const fruits = ["🍇", "🍊", "🍐", "🍒", "🍋"];

const slots: DiscordCommand = {
	conf: {
		aliases: [],
		permLevel: Permissions.DEFAULT,
		category: "Eğlence"
	},

	help: {
		name: "slots",
		description: "Slots oyununu oynarsınız.",
		usage: "slots"
	},

	slashCommand: () => new SlashCommandBuilder(),

	execute({ message }) {
		const slot1 = fruits[Math.floor(Math.random() * fruits.length)];
		const slot2 = fruits[Math.floor(Math.random() * fruits.length)];
		const slot3 = fruits[Math.floor(Math.random() * fruits.length)];

		if (slot1 === slot2 && slot1 === slot3) {
			message.reply({
				content: stripIndents`
            ${slot1} : ${slot2} : ${slot3}
            Tebrikler, kazandınız!
            `,
				ephemeral: true
			});
		} else {
			message.reply({
				content: stripIndents`
            ${slot1} : ${slot2} : ${slot3}
            Eyvah, kaybettin!
            `,
				ephemeral: true
			});
		}
	}
};

export default slots;
