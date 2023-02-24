const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const {
  createMysqlConnection,
  addToWhitelist,
  addToBlacklist,
  removeFromBlacklist,
  removeFromWhitelist,
  existsInBlacklist,
  existsInWhitelist,
} = require("../database.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dadrole")
    .setDescription("Add/Block role permission.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Add permission for a role to use Hi-Im-DadBot.")
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("Role to give bot permissions.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Remove permissions to use Hi-Im-DadBot.")
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("Role to remove permissions from.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("block")
        .setDescription("Block role from using Hi-Im-DadBot.")
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("Role to block from using any commands.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("unblock")
        .setDescription("Unblock role from role blacklist.")
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("Role to unblock from role blacklist.")
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    const guild_id = interaction.guildId;
    const role = interaction.options.getRole("role");
    const connection = createMysqlConnection();

    switch (interaction.options.getSubcommand()) {
      
      // command: /dadrole add {role}
      case "add":
        var exists = await existsInWhitelist(connection, guild_id, role.id);
        if (!exists) {
          await addToWhitelist(connection, guild_id, role.name, role.id);
        } else {
          await interaction.reply({
            content: `Role:${role.name} is already whitelisted.`,
            ephemeral: true,
          });
          break;
        }
        await interaction.reply({
          content: `Added Role:${role.name} to whitelisted roles.`,
          ephemeral: true,
        });
        break;

      // command: /dadrole remove {role}
      case "remove":
        var exists = await existsInWhitelist(connection, guild_id, role.id);
        if (exists) {
          await removeFromWhitelist(connection, guild_id, role.id);
        } else {
          await interaction.reply({
            content: `Role:${role.name} is not whitelisted.`,
            ephemeral: true,
          });
          break;
        }
        await interaction.reply({
          content: `Removed Role:${role.name} from whitelisted roles.`,
          ephemeral: true,
        });
        break;

      // command: /dadrole block {role}
      case "block":
        var exists = await existsInBlacklist(connection, guild_id, role.id);
        if (!exists) {
          await addToBlacklist(connection, guild_id, role.name, role.id);
        } else {
          await interaction.reply({
            content: `Role:${role.name} is already blacklisted.`,
            ephemeral: true,
          });
          break;
        }
        await interaction.reply({
          content: `Added Role:${role.name} to blacklisted roles.`,
          ephemeral: true,
        });
        break;

      // command: /dadrole unblock {role}
      case "unblock":
        var exists = await existsInBlacklist(connection, guild_id, role.id);
        if (exists) {
          await removeFromBlacklist(connection, guild_id, role.id);
        } else {
          await interaction.reply({
            content: `Role:${role.name} is not blacklisted.`,
            ephemeral: true,
          });
          break;
        }
        await interaction.reply({
          content: `Removed Role:${role.name} from blacklisted roles.`,
          ephemeral: true,
        });
        break;
    }
    connection.end();
  },
};
