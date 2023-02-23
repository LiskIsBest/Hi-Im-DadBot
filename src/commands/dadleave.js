const { SlashCommandBuilder} = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dadleave")
    .setDescription("Hi-Im-dad-bot leaves the voice call!"),
    async execute(interaction){
      await interaction.reply({ content: "Leaving voice chat!", ephemeral: true });
      const voiceChannel = interaction.member?.voice.channel;

      const voiceConnection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: interaction.guildId,
        adapterCreator: interaction.guild.voiceAdapterCreator,
        selfDeaf: false,
        selfMute: false,
      });

      voiceConnection.destroy()
    }
}