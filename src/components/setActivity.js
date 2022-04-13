module.exports = client => {
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

	let firstAct = Math.floor(Math.random() * activities.length);
	client.user.setActivity(activities[firstAct].name, { type: activities[firstAct].type });
	firstAct = null;
	setInterval(() => {
		const act = Math.floor(Math.random() * activities.length);
		client.user.setActivity(activities[act].name, { type: activities[act].type });
	}, client.config.activityInterval);
	client.user.setStatus(client.config.status); //* Bot Status
};
