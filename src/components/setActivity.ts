import { Client, ExcludeEnum, PresenceStatusData } from "discord.js";
import { ActivityTypes } from "discord.js/typings/enums";

export = (client: Client) => {
	const activities = [
		{
			name: `www.turkishmethods.com`,
			type: "WATCHING",
		},
		{
			name: `TurkishMethods`,
			type: "WATCHING",
		},
		{
			name: `${client.config.prefix}yardım`,
			type: "LISTENING",
		},
	];

	const firstAct = Math.floor(Math.random() * activities.length);
	client.user.setActivity(activities[firstAct].name, { type: activities[firstAct].type as ExcludeEnum<typeof ActivityTypes, "CUSTOM"> });
	setInterval(() => {
		const act = Math.floor(Math.random() * activities.length);
		client.user.setActivity(activities[act].name, { type: activities[act].type as ExcludeEnum<typeof ActivityTypes, "CUSTOM"> });
	}, client.config.activityInterval);
	client.user.setStatus(client.config.status as PresenceStatusData); //* Bot Status
};
