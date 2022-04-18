import { JsonDatabase } from "wio.db";
import path from "path";

export = (dbName = "db") => new JsonDatabase({ databasePath: path.join(__dirname, "..", "databases", `${dbName}.json`) });
