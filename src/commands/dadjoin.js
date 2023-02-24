const { SlashCommandBuilder } = require("discord.js");
const { joinVoiceChannel, getVoiceConnection } = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dadjoin")
    .setDescription("Hi-Im-dad-bot joins the voice call!"),
  async execute(interaction) {
    if (getVoiceConnection(interaction.guildId)) {
      await interaction.reply({ 
        content: "Hi-Im-DadBot is already in a call.",
        ephemeral: true,
      });
      return
    }
    await interaction.reply({
      content: `Joining ${interaction.member?.voice.channel.name}`,
    });
    const voiceChannel = interaction.member?.voice.channel;

    const voiceConnection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: interaction.guildId,
      adapterCreator: interaction.guild.voiceAdapterCreator,
      selfDeaf: false,
      selfMute: false,
    });
  },
};
