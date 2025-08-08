module.exports = {
  name: 'volume',
  aliases: ['v', 'set', 'set-volume'],
  inVoiceChannel: true,
  run: async (client, message, args) => {
    const queue = client.distube.getQueue(message)
    if (!queue) return message.channel.send(`${client.emotes.error} | There is nothing in the queue right now!`)
    const volume = parseInt(args[0])
    if (isNaN(volume)) return message.channel.send(`${client.emotes.error} | Please enter a valid number!`)
    queue.setVolume(volume)
    
  if (volume > 250) return message.channel.send(`You Cant Set Voice More Than 250`)
    
    message.channel.send(`${client.emotes.success} | Volume set to \`${volume}\``)
  }
}
