const { REST, Routes } = require("discord.js");
const path = require("node:path");
const fs = require("node:fs");
require("dotenv").config();

TOKEN = process.env.TOKEN;
CLIENT_ID = process.env.CLIENT_ID;

const rest = new REST({ version: 10 }).setToken(TOKEN);

(() => {
  rest
  .put(Routes.applicationCommands(CLIENT_ID), { body: [] })
  .then(() => console.log("Successfully deleted all application commands."))
  .catch(console.error);
})();
