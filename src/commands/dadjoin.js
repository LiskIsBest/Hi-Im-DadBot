const { SlashCommandBuilder } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dadjoin")
    .setDescription("Hi-Im-dad-bot joins the voice call!"),
    async execute(interaction){
      await interaction.reply({ content: "Joining voice chat!", ephemeral: true });
      const voiceChannel = interaction.member?.voice.channel;

      const voiceConnection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: interaction.guildId,
        adapterCreator: interaction.guild.voiceAdapterCreator,
        selfDeaf: false,
        selfMute: false,
      }); 
    }
}