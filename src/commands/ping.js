const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	conf: {
		aliases: ["botping", "bot-ping"],
		permLevel: 0,
		category: "Genel",
	},

	help: {
		name: "ping",
		description: "Botun pingini gösterir.",
		usage: "ping",
	},

	slashCommand: () => new SlashCommandBuilder(),

	async execute({ client, message }) {
		const getStatus = ping => {
			let status;
			if (ping <= 50 && ping >= 0) status = "Mükemmel";
			else if (ping >= 50 && ping <= 150) status = "İdare Eder";
			else if (ping >= 150 && ping <= 200) status = "Kötü";
			else if (ping >= 200) status = "Çok Kötü";
			else status = "Hata";
			return status;
		};

		const msg = await message.channel.send("Hesaplanıyor...");
		message.reply({ content: `🏓**Pong!**\n**Mesaj gecikmesi**\n **${msg.createdTimestamp - message.createdTimestamp}ms** (${getStatus(msg.createdTimestamp - message.createdTimestamp)})\n**Socket gecikmesi**\n **${client.ws.ping}ms** (${getStatus(client.ws.ping)})`, ephemeral: true });
		msg.delete();
	},
};
