import { GuildMember, MessageAttachment, TextChannel } from "discord.js";
import Canvas from "canvas";
import path from "node:path";

export default async (member: GuildMember) => {
	const { client } = member;
	const { config } = client;
	if (member.guild.id !== config.guild) return;
	if (member.user.bot) member.roles.add("881317045524893706").catch(() => {});
	else {
		await member.roles.add("842687002406158337").catch(() => {});
		const canvas = Canvas.createCanvas(700, 300);
		const ctx = canvas.getContext("2d");
		const background = await Canvas.loadImage(path.join(__dirname, "..", "img", "turkishmethods.jpg"));
		let x = 0;
		let y = 0;
		ctx.drawImage(background, x, y, canvas.width, canvas.height);
		const pfp = await Canvas.loadImage(member.user.displayAvatarURL({ format: "png", size: 128 }));
		x = canvas.width / 2 - pfp.width / 2;
		y = 25;
		ctx.drawImage(pfp, x, y);
		ctx.fillStyle = "#ffffff";
		ctx.font = "35px sans-serif";
		let text = `Hoş geldin ${member.user.tag}!`;
		x = canvas.width / 2 - ctx.measureText(text).width / 2;
		ctx.fillText(text, x, 60 + pfp.height);
		ctx.font = "30px sans-serif";
		text = `Üye #${member.guild.memberCount}`;
		x = canvas.width / 2 - ctx.measureText(text).width / 2;
		ctx.fillText(text, x, 100 + pfp.height);
		ctx.font = "27px sans-serif";
		x = canvas.width / 2 - ctx.measureText(text).width / 2;
		if (new Date(member.user.createdAt).getTime() > Date.now() - 3 * 24 * 60 * 60 * 1000) {
			text = "(!) Spam";
			ctx.fillStyle = "red";
			x = x + 30;
		} else {
			text = `Oluşturma Tarihi : ${new Date(member.user.createdAt).toLocaleDateString()}`;
			ctx.fillStyle = "#ffffff";
			x = x - 100;
		}
		ctx.fillText(text, x, 130 + pfp.height);
		const attachment = new MessageAttachment(canvas.toBuffer(), "Hoşgeldin_Dostum.png");
		(member.guild.channels.cache.get("913518864590073866") as TextChannel).send({ files: [attachment] });
	}
};
