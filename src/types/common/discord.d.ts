import { Collection } from "discord.js";
import config from "../../config";
import AntiSpam from "discord-anti-spam";
import { GiveawaysManager } from "discord-giveaways";

declare module "discord.js" {
	export interface Client {
		config: typeof config;
		commands: Collection;
		aliases: Collection;
		slashCommands: Collection;
		antiSpam: AntiSpam;
		giveawaysManager: GiveawaysManager;
		reload: { command: (command: string) => Promise<void> };
		load: { command: (command: string) => Promise<void> };
		unload: { command: (command: string) => Promise<void> };
		restart: (id?: string) => void;
		lockit: { [channelID: string]: setTimeout<void> };
	}

	export interface MessageOptions {
		ephemeral?: boolean;
	}
}
