const reqEvent = event => require(`../events/${event}`);

module.exports = client => require("fs").readdir("./events/", (e, sf) => (e ? console.error(e) : sf.forEach(f => client.on(f.split(".")[0], reqEvent(f.split(".")[0])))));
