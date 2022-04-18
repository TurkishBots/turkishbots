import { Client } from "discord.js";
import path from "path";
import { readdir } from "fs";

const reqEvent = (event: string) => import(path.join(__dirname, "..", "events", event)).then(e => e.default);

export = (client: Client) => readdir("./events/", (e, sf) => (e ? console.error(e) : sf.forEach(async f => client.on(f.split(".")[0], await reqEvent(f.split(".")[0])))));
