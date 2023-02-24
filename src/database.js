const mysql = require("mysql2");
require("dotenv").config();

function unixtime() {
  return Math.floor(new Date().getTime() / 1000);
}

class DataBaseConnection {
  constructor() {
    this.connection = this.createMysqlConnection();
  }
  createMysqlConnection() {
    return mysql.createConnection({
      host: process.env.MYSQLHOST,
      user: process.env.MYSQLUSER,
      password: process.env.MYSQLPASSWORD,
      database: process.env.MYSQLDATABASE,
      port: process.env.MYSQLPORT,
    });
  }
  isInServers(guildId) {
    var check;
    this.connection.connect();
    this.connection.query(
      `SELECT EXISTS(SELECT * FROM servers WHERE guild_id = ${guildId})`,
      (error, results, fields) => {
        if (error) console.error(error);
        if (results.values()[0] == undefined){
          check = false;
        } else {
          check = true;
        }
        this.connection.end();
      }
    );
    return check;
  }
  insertIntoServers(guildId) {
    this.connection.connect();
    this.connection.query(
      `INSERT INTO servers (guild_id, date_added, whitelisted, blacklisted, in_server)
       VALUES (${guildId}, FROM_UNIXTIME(${unixtime()}), false, false, false)`,
      (error, results, fields) => {
        if (error) console.error(error);
        this.connection.end();
      }
    );
  }
  setInServer(guildId, val) {
    this.connection.connect();
    this.connection.query(
      `UPDATE servers
       SET in_server = ${val}
       WHERE guild_id = ${guildId}`,
      (error, results, fields) => {
        if (error) console.error(error);
        this.connection.end();
      }
    );
  }
}

const guild_id = 884730247466090546;

const dbObject = new DataBaseConnection();
// dbObject.insertIntoServers(guild_id);

console.log(dbObject.isInServers(guild_id));

module.exports = {
  DataBaseConnection,
};
