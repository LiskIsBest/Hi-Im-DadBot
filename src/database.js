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

function isInServersTable(connection, guild_id) {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM servers WHERE guild_id = ?",
      [guild_id],
      (error, results) => {
        return error ? reject(error) : resolve(results[0]);
      }
    );
  });
}

function insertIntoServers(connection, guild_id) {
  return new Promise((resolve, reject) => {
    connection.query(
      `INSERT INTO servers (guild_id, date_added, has_whitelist, has_blacklist, in_server)
         VALUES (?, FROM_UNIXTIME(?), false, false, false)`,
      [guild_id, unixtime()],
      (error, results) => {
        if (error) console.error(error);
        return error ? reject(error) : resolve(results);
      }
    );
  });
}

function deleteFromServers(connection, guild_id) {
  return new Promise((resolve, reject) => {
    connection.query(
      `DELETE FROM servers WHERE guild_id = ?`,
      [guild_id],
      (error, results) => {
        if (error) console.error(error);
        return error ? reject(error) : resolve(results);
      }
    );
  });
}

function updateInServer(connection, guild_id, val) {
  return new Promise((resolve, reject) => {
    connection.query(
      `UPDATE servers
       SET in_server = ${val}
       WHERE guild_id = ?`,
      [guild_id],
      (error, results) => {
        if (error) console.error(error);
        return error ? reject(error) : resolve(results);
      }
    );
  });
}

function addToWhitelist(connection, guild_id, role_name, role_id) {
  return new Promise((resolve, reject) => {
    connection.query(
      `INSERT INTO whitelisted_roles (role_name, role_id, date_added, guild_id)
       VALUES (?,?,FROM_UNIXTIME(?),?)`,
      [role_name, role_id, unixtime(), guild_id],
      (error, results) => {
        if (error) console.error(error);
        return error ? reject(error) : resolve(results);
      }
    );
  });
}

function removeFromWhitelist(connection, guild_id, role_id){
  return new Promise((resolve, reject)=>{
    connection.query(
      `DELETE FROM whitelisted_roles
       WHERE guild_id = ? AND role_id = ?`,
      [guild_id, role_id],
      (error, results) => {
        if (error) console.error(error);
        return error ? reject(error) : resolve(results);
      }
    )
  })
}

function addToBlacklist(connection, guild_id, role_name, role_id) {
  return new Promise((resolve, reject) => {
    connection.query(
      `INSERT INTO blacklisted_roles (role_name, role_id, date_added, guild_id)
       VALUES (?,?,FROM_UNIXTIME(?),?)`,
      [role_name, role_id, unixtime(), guild_id],
      (error, results) => {
        if (error) console.error(error);
        return error ? reject(error) : resolve(results);
      }
    );
  });
}

function removeFromBlacklist(connection, guild_id, role_id){
  return new Promise((resolve, reject)=>{
    connection.query(
      `DELETE FROM blacklisted_roles
       WHERE guild_id = ? AND role_id = ?`,
      [guild_id, role_id],
      (error, results) => {
        if (error) console.error(error);
        return error ? reject(error) : resolve(results);
      }
    )
  })
}

function existsInWhitelist(connection, guild_id, role_id) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT role_name, role_id 
       FROM whitelisted_roles 
       WHERE guild_id = ? AND role_id = ?`,
      [guild_id, role_id],
      (error, results) => {
        return error ? reject(error) : resolve(results[0]);
      }
    );
  });
}

function existsInBlacklist(connection, guild_id, role_id) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT role_name, role_id 
       FROM blacklisted_roles 
       WHERE guild_id = ? AND role_id = ?`,
      [guild_id, role_id],
      (error, results) => {
        return error ? reject(error) : resolve(results[0]);
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
  addToWhitelist,
  addToBlacklist,
  removeFromWhitelist,
  removeFromBlacklist,
  existsInBlacklist,
  existsInWhitelist,
};
