require("dotenv").config()
const { DisTube } = require('distube')
const { GatewayIntentBits , Collection ,  Client , ChannelType } = require('discord.js')
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ]
})
const fs = require('fs')
const config = require('./config.json')
const { SpotifyPlugin } = require('@distube/spotify')
const { SoundCloudPlugin } = require('@distube/soundcloud')
const { YtDlpPlugin } = require('@distube/yt-dlp')

client.config = require('./config.json')
client.distube = new DisTube(client, {

  plugins: [
    new SoundCloudPlugin(),
    new SpotifyPlugin(),
    new YtDlpPlugin()
  ],
})
client.distube.setMaxListeners(3); // or whatever number you need

client.commands = new Collection()
client.aliases = new Collection()
client.emotes = config.emoji


fs.readdirSync('./handlers').map(handler => {
require(`./handlers/${handler}`)(client)
})


client.on('ready', () => {
 console.log(`${client.user.tag} is Ready To Play Music.`)
client.user.setStatus('idle')
})

client.on('messageCreate', async message => {
  if (message.author.bot || !message.guild) return
  const prefix = config.prefix
  if (!message.content.startsWith(prefix)) return
  const args = message.content.slice(prefix.length).trim().split(/ +/g)
  const command = args.shift().toLowerCase()
  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command))
  if (!cmd) return
  if (cmd.inVoiceChannel && !message.member.voice.channel) {
    return message.channel.send(`${client.emotes.error} | You must be in a voice channel!`)
  }
  try {
    cmd.run(client, message, args)
  } catch (e) {
    console.error(e)
    message.channel.send(`${client.emotes.error} | Error: \`${e}\``)
  }
})

client.on('voiceStateUpdate', (ns) => {
  if (!ns.guild || ns.member.user.bot) return;

  // auto speak in stage channel
  if (
    ns.channelId &&
    ns.channel.type === ChannelType.GuildStageVoice &&
    ns.guild.members.me.voice.suppress
  ) {
    if (
      ns.guild.members.me.permissions.has("Speak") ||
      (ns.channel && ns.channel.permissionsFor(ns.guild.members.me).has("Speak"))
    ) {
      ns.guild.members.me.voice.setSuppressed(false).catch((e) => {
        console.log(e)
      });
    }
  }
})
const status = queue =>
  `Volume: \`${queue.volume}%\` | Filter: \`${queue.filters.names.join(', ') || 'Off'}\` | Loop: \`${
    queue.repeatMode ? (queue.repeatMode === 2 ? 'All Queue' : 'This Song') : 'Off'
  }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``
client.distube
  .on('playSong', (queue, song) =>
    queue.textChannel.send(
      `${client.emotes.play} | Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${
        song.user
      }\n${status(queue)}`
    )
  )
  .on('addSong', (queue, song) =>
    queue.textChannel.send(
      `${client.emotes.success} | Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
    )
  )
  .on('addList', (queue, playlist) =>
    queue.textChannel.send(
      `${client.emotes.success} | Added \`${playlist.name}\` playlist (${
        playlist.songs.length
      } songs) to queue\n${status(queue)}`
    )
  )
  .on('error', (channel, e) => {
    if (channel) channel.send(`${client.emotes.error} | An error encountered: ${e.toString().slice(0, 1974)}`)
    else console.error(e)
  })
  .on('empty', queue => queue.textChannel.send('Voice channel is empty! Leaving the channel...'))
  .on('searchNoResult', (message, query) =>
    message.channel.send(`${client.emotes.error} | No result found for \`${query}\`!`)
  )
  .on('finish', queue => queue.textChannel.send('Finished!'))
  .on('error', error => console.log(error))

client.login(process.env.TOKEN)
