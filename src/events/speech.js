const {getVoiceConnection, AudioPlayer, createAudioResource, StreamType} = require("@discordjs/voice");
const { getVoiceStream } = require("discord-tts");
require("dotenv").config()

GUILD_ID = process.env.GUILD_ID;

module.exports = {
  name: "speech",
  execute(msg) {
    if (!msg.content) return;
    console.log(msg.content);

    let regex = /(I'm|I\sam)(.*)/
    const found = msg.content.match(regex)
    if (found){
      const voiceConnection = getVoiceConnection(GUILD_ID);
          
      const audioPlayer = new AudioPlayer();
      const stream = getVoiceStream(`Hi ${found[2]}, I'm dad.`);
      const audioResource = createAudioResource(stream, {inputType: StreamType.Arbitrary, inlineVolume:true});
      voiceConnection.subscribe(audioPlayer);
      audioPlayer.play(audioResource);
    } else {
      return;
    }
  },
};