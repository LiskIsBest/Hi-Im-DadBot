const { REST, Routes } = require("discord.js");
const path = require("node:path");
const fs = require("node:fs");
require("dotenv").config();

TOKEN = process.env.TOKEN;
CLIENT_ID = process.env.CLIENT_ID;
GUILD_ID = process.env.GUILD_ID;

const commands = [];
const commandFiles = fs
  .readdirSync(path.join(__dirname, "commands"))
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`${path.join(__dirname, "commands")}/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: 10 }).setToken(TOKEN);

(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    const data = await rest.put(
      Routes.applicationCommand(CLIENT_ID),
      { body: commands }
    );

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    console.log(error);
  }
})();
