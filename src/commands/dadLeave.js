const { SlashCommandBuilder } = require("discord.js");
const { getVoiceConnection } = require("@discordjs/voice");
const { createMysqlConnection, getListedRoles } = require("../database.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dadleave")
    .setDescription("Hi-Im-dad-bot leaves the voice call!"),
  async execute(interaction) {
    const guild_id = interaction.guildId;
    const member = interaction.member.roles.cache;

    const connection = createMysqlConnection();
    const whitelisted_roles = await getListedRoles(
      connection,
      guild_id,
      "white"
    );
    const blacklisted_roles = await getListedRoles(
      connection,
      guild_id,
      "black"
    );

    function permCheck(member) {
      var check = false;
      for (const role of whitelisted_roles) {
        if (member.some((r) => r.id === role[1])) {
          check = true;
        }
      }
      for (const role of blacklisted_roles) {
        if (member.some((r) => r.id === role[1])) {
          check = false;
        }
      }
      return check;
    }

    if (permCheck(member) === false) {
      await interaction.reply({
        content: `You do not have permission use this command!`,
        ephemeral: true,
      });
      return;
    }

    const voiceChannel = interaction.member?.voice.channel;
    const voiceConnection = getVoiceConnection(interaction.guildId);
    if (!voiceConnection) {
      await interaction.reply({
        content: "Hi-Im-DadBot is not in a voice call.",
        ephemeral: true,
      });
      return;
    }

    if (voiceChannel.id !== voiceConnection.joinConfig.channelId) {
      await interaction.reply({
        content: "You must be in the same voice call to use /dadleave.",
        ephemeral: true,
      });
      return;
    }

    await interaction.reply({ content: `Leaving ${voiceChannel.name}` });
    voiceConnection.destroy();
  },
};
