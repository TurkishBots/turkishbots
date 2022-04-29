import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed, Permissions } from "discord.js";
import { DiscordCommand } from "../types";
import categories from "../components/categories";
import fs from "fs";

const help: DiscordCommand = {
	conf: {
		aliases: ["help", "cmds", "komutlar", "y"],
		permLevel: Permissions.DEFAULT,
		category: "Genel"
	},

	help: {
		name: "yardım",
		description: "Komutlar hakkında bilgi verir.",
		usage: "yardım [kategori] [komut]"
	},

	slashCommand: () =>
		new SlashCommandBuilder()
			.addStringOption(option =>
				option
					.setName("kategori")
					.setDescription("Kategori hakkında bilgi")
					// @ts-ignore
					.setChoices(categories.map(c => [c.name, c.name]))
					.setRequired(false)
			)
			.addStringOption(option => option.setName("komut").setDescription("Komut hakkında bilgi").setRequired(false)),

	execute({ client, message, args, emojis, unicode, isOwner, isSlash }) {
		const { prefix } = isSlash ? { prefix: "/" } : client.config;
		const socialLinks = ` **[TurkishMethods](${client.config.siteURL})**`;
		const settings = {
			authorImage: client.user.displayAvatarURL(),
			links: "❯ Bağlantılar",
			footer: `${message.author.tag} Tarafından istendi.`,
			description: `**${prefix}$(cmd.help.name)** → $(cmd.help.description)`,
			special_chars: `**[]** = Opsiyonel\n**<>** = Zorunlu`
		};

		if (isSlash && args[1]) return message.reply({ content: `${emojis.error} ${unicode.bullet} Hem kategori hemde komut seçemezsiniz!`, ephemeral: true });

		if ((isSlash && args[0]["name"] === "komut") || (!isSlash && args[1])) {
			let cat: { name: string; alisas: string[]; admin?: undefined } | { name: string; alisas: any[]; admin: boolean };
			if (isSlash) {
				fs.readdirSync("./commands/").forEach(f => {
					const props = require(`./${f}`);
					if (props?.help?.name !== args[0]["value"]) return;
					cat = categories.find(c => c.name === props.conf.category);
				});
				// @ts-ignore
			} else cat = categories.find(c => c.name.toLowerCase() === args[0].toLowerCase());
			const command = client.commands.filter((c: DiscordCommand) => c?.conf?.category?.toLowerCase?.() === cat?.name?.toLowerCase?.() && c?.help?.name === (isSlash ? args[0]["value"] : args[1])).first();

			if (!cat) return message.reply({ content: `${emojis.error} ${unicode.bullet} İstenilen kategori \`${args[0]}\` bulunamadı.`, ephemeral: true });
			if (cat.admin && !isOwner) return message.reply({ content: `${emojis.error} ${unicode.bullet} Bu kategorideki komutlar hakkında sadece adminler bilgi alabilir.`, ephemeral: true });
			if (!command) return message.reply({ content: `${emojis.error} ${unicode.bullet} İstenilen komut \`${args[1]}\` bulunamadı.`, ephemeral: true });
			const embed = new MessageEmbed()
				.setAuthor({ name: `${command.help.name} Komutu hakkında bilgi`, iconURL: settings.authorImage })
				.setColor("RANDOM")
				.setTimestamp();
			if (!isSlash) embed.setFooter({ text: settings.footer, iconURL: message.author.displayAvatarURL() });
			embed
				.setDescription(command.help.description ?? "Bu komutun bir açıklaması yok")
				.addField("Diğer kullanımlar", "**" + command.conf?.aliases?.join?.("\n ") + "**" ?? "Diğer kullanım yok", true)
				.addField("Sunucuya özel?", command.conf.guildOnly ? "Evet" : "Hayır", true)
				.addField("Kullanım", `**${prefix + command.help.usage}**`)
				.addField("Özel ifadeler", settings.special_chars, true)
				.addField(settings.links, socialLinks, false);
			message.reply({ embeds: [embed], ephemeral: true });
		} else if ((isSlash && args[0]["name"] === "kategori") || (!isSlash && args[0])) {
			// @ts-ignore
			if (!categories.find(c => c.name.toLowerCase() === args[0].toLowerCase())) return message.reply({ content: `${emojis.error} ${unicode.bullet} İstenilen kategori \`${args[0]}\` bulunamadı.`, ephemeral: true });
			categories.forEach(c => {
				// @ts-ignore
				if ((isSlash && (args[0]["value"].toLowerCase() === c.name.toLowerCase() || (c.alisas && c.alisas.includes(args[0]["value"].toLowerCase())))) || (!isSlash && (args[0].toLowerCase() === c.name.toLowerCase() || (c.alisas && c.alisas.includes(args[0].toLowerCase()))))) {
					if (c.admin && !isOwner) message.reply({ content: `${emojis.error} ${unicode.bullet} Bu kategorideki komutları sadece adminler görebilir.`, ephemeral: true });
					else {
						const embed = new MessageEmbed()
							.setAuthor({ name: `${client.user.username} • ${c.name} Komutları`, iconURL: settings.authorImage })
							.setColor("RANDOM")
							.setTimestamp();
						if (!isSlash) embed.setFooter({ text: settings.footer, iconURL: message.author.displayAvatarURL() });
						embed
							.setDescription(
								client.commands
									.filter((cmd: DiscordCommand) => cmd.conf.category && cmd.conf.category.toLowerCase() === c.name.toLowerCase())
									.map((cmd: DiscordCommand) => settings.description.replaceAll("$(cmd.help.name)", cmd.help.name).replaceAll("$(cmd.help.description)", cmd.help.description))
									.join("\n ")
							)
							.addField(settings.links, socialLinks, false);
						return message.reply({ embeds: [embed], ephemeral: true });
					}
				}
			});
		} else {
			let commands = "";
			categories.forEach(c => (c.admin && !isOwner ? null : (commands += `\n**[${prefix}yardım ${c.name}](${client.config.supportServer})** `)));
			const embed = new MessageEmbed()
				.setAuthor({ name: `${client.user.username} • Komut Listesi`, iconURL: settings.authorImage })
				.setThumbnail(client.user.avatarURL())
				.setColor("RANDOM")
				.setDescription(`• Öneri ve hataları yetkililere bildirebilirsin ve çözümlenmesi için ${client.user.username}'a **[Katkıda bulunabilirsin](${client.config.supportServer})** !`)
				.addField("• Komutlar", commands)
				.addField(settings.links, socialLinks, false)
				.setTimestamp();
			if (!isSlash) embed.setFooter({ text: `Bu komutu kullanan kullanıcı ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });
			message.reply({ embeds: [embed], ephemeral: true });
		}
	}
};

export default help;
