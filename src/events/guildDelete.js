const { Events } = require("discord.js");
const {
  createMysqlConnection,
  isInServersTable,
  insertIntoServers,
  updateInServer,
} = require("../database.js");

module.exports = {
  name: Events.GuildDelete,
  async execute(guild) {
    const guild_id = guild.id
    const dbConnection = createMysqlConnection();
    const in_server = await isInServersTable(dbConnection, guild_id);
    await updateInServer(dbConnection, guild_id, false);
    dbConnection.end();
    console.log(`UPDATED servers.in_server TO false FOR guild_id = ${guild_id}`);
  },
};
