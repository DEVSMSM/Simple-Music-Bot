module.exports = {
  name: 'playskip',
  aliases: ['ps'],
  inVoiceChannel: true,
  run: async (client, message, args) => {
    const string = args.join(' ')
    if (!string) return message.channel.send(`${client.emotes.error} | Please enter a song url or query to search.`)
    client.distube.play(message.member.voice.channel, string, {
      textChannel: message.channel,
      skip: true
    })
  }
}
