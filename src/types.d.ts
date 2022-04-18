import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, Message } from "discord.js";

export declare interface DiscordCommand {
	conf: {
		aliases: string[];
		permLevel: number | string;
		category: string;
		guildOnly?: boolean;
		disabled?: boolean;
	};

	slashCommand?: (client: Client) => SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;

	help: {
		name: string;
		description: string;
		usage: string;
	};

	execute: ({ client, message, args, emojis, unicode, isOwner, isSlash }: { client: Client; message: Message; args: string[] | { name: string; type: string; value: any }[]; emojis: { [name: string]: string }; unicode: { [name: string]: string }; isOwner: boolean; isSlash: boolean }) => any;
}
