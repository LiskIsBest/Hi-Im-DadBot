const { SlashCommandBuilder } = require("discord.js");
const { joinVoiceChannel, getVoiceConnection } = require("@discordjs/voice");
const { createMysqlConnection, getListedRoles } = require("../database.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dadjoin")
    .setDescription("Hi-Im-dad-bot joins the voice call!"),
  async execute(interaction) {
    const guild_id = interaction.guildId;
    const member = interaction.member;
    const channel = interaction.channel;

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
    connection.end();

    function permCheck(member) {
      if(member.permissionsIn(channel).has("ADMINISTRATOR")) return true;
      var check = false;
      for (const role of whitelisted_roles) {
        if (member.roles.cache.some((r) => r.id === role[1])) {
          check = true;
        }
      }
      for (const role of blacklisted_roles) {
        if (member.roles.cache.some((r) => r.id === role[1])) {
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

    if (getVoiceConnection(interaction.guildId)) {
      await interaction.reply({
        content: "Hi-Im-DadBot is already in a call.",
        ephemeral: true,
      });
      return;
    }
    const voiceChannel = interaction.member?.voice.channel;

    const voiceConnection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: guild_id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
      selfDeaf: false,
      selfMute: false,
    });
    await interaction.reply({
      content: `Joining ${interaction.member?.voice.channel.name}`,
    });
    return;
  },
};
