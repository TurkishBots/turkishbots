require("dotenv").config({ path: "../.env" });

const conf = {
	token: process.env.BOT_TOKEN,
	clientSecret: process.env.BOT_SECRET,
	isDev: require("os").userInfo().username === "GamerboyTR",
	prefix: "?",
	siteURL: "https://turkishmethods.com",
	guild: "841385554792415282",
	supportServer: "https://discord.gg/turkishmethods",
	owners: ["830808204711559219", "530043492014096384"],
	status: "idle",
	activityInterval: 5000,
	deleteInterval: 5000,
	startFile: "./app.js",
	webhooks: {
		log: {
			url: `https://discord.com/api/webhooks/940638138290810920/${process.env.WEBHOOKS_LOG}`,
			id: "940638138290810920",
			token: process.env.WEBHOOKS_LOG,
			channel: "940620150061826108"
		}
	},
	emojis: {
		success: "<:success:940304315371884625>",
		error: "<:error:940304381356683356>",
		info: "<:info:940304243108229260>",
		warning: "<:warning:943876201091584021>",
		channel: "<:channel:942130776017883226>",
		members: "<:members:942131914523951114>",
		discordjs: "<:djs:942876446177767484>",
		nodejs: "<:nodejs:942134067154010154>",
		plus_1: "<:plus_1:841656328820490302>",
		minus_1: "<:minus_1:841656328954445855>",
		compile_dots: "<a:dots:963443763773046804>",
		typescript: "<:TypeScript:965671929413529730>",
		javascript: "<:JavaScript:965672101078003773>",
		question_mark: "<:question_mark:965719852251746304>"
	},
	unicodes: {
		bullet: "•"
	}
};

conf.prefix = conf.isDev ? "B?" : conf.prefix;

export default conf;
