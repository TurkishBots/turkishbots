const { JsonDatabase } = require("wio.db");
const path = require("path");

module.exports = (dbName = "db") => new JsonDatabase({ databasePath: path.join(__dirname, "..", "databases", `${dbName}.json`) });
