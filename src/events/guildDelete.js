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
    const connection = createMysqlConnection();
    const in_server = await isInServersTable(connection, guild_id);
    await updateInServer(connection, guild_id, false);
    connection.end();
    console.log(`UPDATED servers.in_server TO false FOR guild_id = ${guild_id}`);
  },
};
