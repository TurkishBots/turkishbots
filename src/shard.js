const { ShardingManager, WebhookClient } = require("discord.js");
const { token, startFile, webhooks } = require("./config");
const db = require("./components/database")();
const chalk = require("chalk");
const moment = require("moment");
const webhookClient = new WebhookClient({ id: webhooks.log.id, token: webhooks.log.token });

const sLog = (...message) => console.log(`${chalk.yellow(`[${moment().format("YYYY-MM-DD HH:mm:ss")}]`)} ${chalk.yellowBright("[SHARD]")}`, ...message);
const sErr = (...message) => sLog(chalk.redBright("[ERROR]"), ...message);

sLog(chalk.greenBright("Başlatılıyor..."));

const manager = new ShardingManager(startFile, {
	totalShards: "auto",
	token,
	respawn: true,
	mode: "process",
});

manager.on("shardCreate", shard => {
	let slicer = "";
	for (let i = 0; i < 50; i++) slicer += "\\_";
	webhookClient.send(`**${slicer}**`);
	webhookClient.send("**[Shard]** Yükleme **başlatılıyor**.");
	webhookClient.send(`**[Shard]** Yüklenen shard **${shard.id + 1}/${manager.totalShards}**.`);
	sLog(`${shard.id + 1}/${shard.manager.totalShards}`);
	shard.on("ready", () => webhookClient.send(`**[Shard]** \`${shard.id + 1}.\` Shard **hazır**.`));
	shard.on("disconnect", () => {
		webhookClient.send(`**[Shard]** \`${shard.id + 1}.\` Shard Discord'dan **düştü**.`);
		sErr("Shard disconnected");
	});
	shard.on("reconnection", () => {
		webhookClient.send(`**[Shard]** \`${shard.id + 1}.\` Shard Discord'a yeniden **bağlandı**.`);
		sLog(chalk.cyanBright("Shard reconnected"));
	});
	shard.on("error", error => {
		webhookClient.send(`**[Shard]** \`${shard.id + 1}.\` Shard bir hata ile karşılaştı.\n\`\`\`js\n${error}\`\`\``);
		sErr("Shard error", error);
	});
	shard.on("message", message => {
		webhookClient.send(`**[Shard]** \`${shard.id + 1}.\` Shard bir mesaj gönderdi.\n\`\`\`js\n${message}\`\`\``);
		sLog(chalk.cyanBright("Shard message"), message);
	});
	shard.on("death", _ => {
		webhookClient.send(`**${slicer}**`);
		if (!db.has("restart")) webhookClient.send(`**[Shard]** Beklenmedik bir şekilde tüm shardlar **sonlandırıldı**.`);
		sErr("Shardlar sonlandırıldı");
	});
});

manager.spawn();
