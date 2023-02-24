const mysql = require("mysql2");
require("dotenv").config();

function unixtime() {
  return Math.floor(new Date().getTime() / 1000);
}

function createMysqlConnection() {
  return mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT,
    rowsAsArray: true,
    supportBigNumbers: true,
  });
}

function isInServersTable(connection, guildId) {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM servers WHERE guild_id = ?",
      [guildId],
      (error, results) => {
        return error ? reject(error) : resolve(results[0]);
      }
    );
  });
}

function insertIntoServers(connection, guildId) {
  return new Promise((resolve, reject) => {
    connection.query(
      `INSERT INTO servers (guild_id, date_added, has_whitelist, has_blacklist, in_server)
         VALUES (?, FROM_UNIXTIME(?), false, false, false)`,
      [guildId, unixtime()],
      (error, results) => {
        if (error) console.error(error);
        return error ? reject(error) : resolve(results);
      }
    );
  });
}

function deleteFromServers(connection, guildId){
  return new Promise((resolve, reject)=>{
    connection.query(
      `DELETE FROM servers WHERE guild_id = ?`,
      [guildId],
      (error, results)=>{
        if (error) console.error(error);
        return error ? reject(error) : resolve(results);
      }
    )
  })
}

function updateInServer(connection, guildId, val) {
  return new Promise((resolve, reject) => {
    connection.query(
      `UPDATE servers
       SET in_server = ${val}
       WHERE guild_id = ?`,
      [guildId],
      (error, results) => {
        if (error) console.error(error);
        return error ? reject(error) : resolve(results);
      }
    );
  });
}

module.exports = {
  createMysqlConnection,
  isInServersTable,
  insertIntoServers,
  deleteFromServers,
  updateInServer,
};
