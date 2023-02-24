const { Events } = require("discord.js");
const {
  createMysqlConnection,
  isInServersTable,
  insertIntoServers,
  updateInServer,
} = require("../database.js");

module.exports = {
  name: Events.GuildCreate,
  async execute(guild) {
    const guild_id = guild.id
    const connection = createMysqlConnection();
    const in_server = await isInServersTable(connection, guild_id);
    if (!in_server){
      await insertIntoServers(connection, guild_id);
    }
    await updateInServer(connection, guild_id, true);
    connection.end();
    console.log(`UPDATED servers.in_server TO true FOR guild_id = ${guild_id}`);
  },
};
