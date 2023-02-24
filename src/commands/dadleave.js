const { SlashCommandBuilder} = require("discord.js");
const { getVoiceConnection } = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dadleave")
    .setDescription("Hi-Im-dad-bot leaves the voice call!"),
    async execute(interaction){
      const voiceChannel = interaction.member?.voice.channel;
      const voiceConnection = getVoiceConnection(interaction.guildId)
      if (!voiceConnection) {
        await interaction.reply({
          content: "Hi-Im-DadBot is not in a voice call.",
          ephemeral: true,
        })
      }

      if (voiceChannel.id !== voiceConnection.joinConfig.channelId){
        await interaction.reply({
          content: "You must be in the same voice call to use /dadleave.",
          ephemeral: true,
        })
      }
      
      await interaction.reply({ content: `Leaving ${voiceChannel.name}` });
      voiceConnection.destroy()
    }
}