import { Collection, Message, TextChannel, User } from "discord.js";
import request from "node-superfetch";
import crypto from "crypto";
const { IMGUR_KEY } = process.env;
const yes = ["evet", "evt", "ewt", "yes"];
const no = ["hayır", "hyr", "yo", "no"];

export default class Util {
	static wait(ms: number) {
		return new Promise(r => setTimeout(r, ms));
	}

	static shuffle(array: any) {
		const arr = array.slice(0);
		for (let i = arr.length - 1; i >= 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			const temp = arr[i];
			arr[i] = arr[j];
			arr[j] = temp;
		}
		return arr;
	}

	static list(arr: any[], conj = "and") {
		const len = arr.length;
		return `${arr.slice(0, -1).join(", ")}${len > 1 ? `${len > 2 ? "," : ""} ${conj} ` : ""}${arr.slice(-1)}`;
	}

	static shorten(text: string, maxLen = 2000) {
		return text.length > maxLen ? `${text.substring(0, maxLen - 3)}...` : text;
	}

	static duration(ms: number) {
		const sec = Math.floor((ms / 1000) % 60).toString();
		const min = Math.floor((ms / (1000 * 60)) % 60).toString();
		const hrs = Math.floor(ms / (1000 * 60 * 60)).toString();
		return `${hrs.padStart(2, "0")}:${min.padStart(2, "0")}:${sec.padStart(2, "0")}`;
	}

	static randomRange(min: number, max: number) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	static trimArray(arr: string[], maxLen = 10) {
		if (arr.length > maxLen) {
			const len = arr.length - maxLen;
			arr = arr.slice(0, maxLen);
			arr.push(`${len} more...`);
		}
		return arr;
	}

	static base64(text: string, mode = "encode") {
		if (mode === "encode") return Buffer.from(text).toString("base64");
		if (mode === "decode") return Buffer.from(text, "base64").toString("utf8") || null;
		throw new TypeError(`${mode} is not a supported base64 mode.`);
	}

	static hash(text: crypto.BinaryLike, algorithm: string) {
		return crypto.createHash(algorithm).update(text).digest("hex");
	}

	static async randomFromImgurAlbum(album: string) {
		const { body } = await request.get(`https://api.imgur.com/3/album/${album}`).set({ Authorization: `Client-ID ${IMGUR_KEY}` });
		if (!body["data"].images.length) return null;
		return body["data"].images[Math.floor(Math.random() * body["data"].images.length)].link;
	}

	static today(timeZone: number) {
		const now = new Date();
		if (timeZone) now.setUTCHours(now.getUTCHours() + timeZone);
		now.setHours(0);
		now.setMinutes(0);
		now.setSeconds(0);
		now.setMilliseconds(0);
		return now;
	}

	static tomorrow(timeZone: number) {
		const today = Util.today(timeZone);
		today.setDate(today.getDate() + 1);
		return today;
	}

	static async awaitPlayers(msg: any, max: any, min: number, { text = "join game", time = 30000 } = {}) {
		const joined = [];
		joined.push(msg.author.id);
		const filter = (res: Message) => {
			if (msg.author.bot) return false;
			if (joined.includes(res.author.id)) return false;
			if (res.content.toLowerCase() !== text.toLowerCase()) return false;
			joined.push(res.author.id);
			return true;
		};
		const verify = await msg.channel.awaitMessages({ filter, max, time, errors: ["time"] });
		verify.set(msg.id, msg);
		if (verify.size < min) return false;
		return verify.map((message: { author: any }) => message.author);
	}

	static async verify(channel: TextChannel, user: User, time = 30000) {
		const filter = (res: Message) => res.author.id === user.id && (yes.includes(res.content.toLowerCase()) || no.includes(res.content.toLowerCase()));

		let err = false;
		const verify = await channel.awaitMessages({ filter, max: 1, time, errors: ["time"] }).catch(() => (err = true));
		if (err) return false;
		const choice = (verify as Collection<string, Message<boolean>>).first().content.toLowerCase();
		return yes.includes(choice);
	}
}
