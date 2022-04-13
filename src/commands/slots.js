const { SlashCommandBuilder } = require("@discordjs/builders");
const { stripIndents } = require("common-tags");
const slots = ["🍇", "🍊", "🍐", "🍒", "🍋"];

module.exports = {
	conf: {
		aliases: [],
		permLevel: 0,
		category: "Eğlence",
	},

	help: {
		name: "slots",
		description: "Slots oyununu oynarsınız.",
		usage: "slots",
	},

	slashCommand: () => new SlashCommandBuilder(),

	execute({ message }) {
		const slot1 = slots[Math.floor(Math.random() * slots.length)];
		const slot2 = slots[Math.floor(Math.random() * slots.length)];
		const slot3 = slots[Math.floor(Math.random() * slots.length)];

		if (slot1 === slot2 && slot1 === slot3) {
			message.reply({
				content: stripIndents`
            ${slot1} : ${slot2} : ${slot3}
            Tebrikler, kazandınız!
            `,
				ephemeral: true,
			});
		} else {
			message.reply({
				content: stripIndents`
            ${slot1} : ${slot2} : ${slot3}
            Eyvah, kaybettin!
            `,
				ephemeral: true,
			});
		}
	},
};
