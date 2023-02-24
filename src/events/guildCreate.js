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
    const dbConnection = createMysqlConnection();
    const in_server = await isInServersTable(dbConnection, guild_id);
    if (!in_server){
      await insertIntoServers(dbConnection, guild_id);
    }
    await updateInServer(dbConnection, guild_id, true);
    dbConnection.end();
    console.log(`UPDATED servers.in_server TO true FOR guild_id = ${guild_id}`);
  },
};
