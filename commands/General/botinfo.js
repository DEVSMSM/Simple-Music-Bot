const { EmbedBuilder } = require("discord.js")
module.exports = {
  name: 'botinfo',
  inVoiceChannel: false,
  run: async (client, message) => {


let days = Math.floor(client.uptime / 86400000);
    let hours = Math.floor(client.uptime / 3600000) % 24;
    let minutes = Math.floor(client.uptime / 60000) % 60;
    let seconds = Math.floor(client.uptime / 1000) % 60;
    const uptime = `${days}d ${hours}h ${minutes}m ${seconds}s`;


let embed = new EmbedBuilder()

.setColor('Gold')
.addFields([{ name: "**Developer**", value:  `\`!                       ....#0001\``, inline: true}, 		
        {
          name: "**Total Guilds**",
          value: `\`${client.guilds.cache.size} Guilds\``,
          inline: true
        },
	{
          name: "**Total Channels**",
          value: `\`${client.channels.cache.size} Channels\``,
          inline: true
        },
        {
          name: "**Total Users**",
          value: `\`${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)} Users\``,
          inline: true
        },

        {
    name: "**⏱️・Uptime**",
          value: `\`${uptime}\``,
          inline: true
        }])
     .setThumbnail(message.member.user.displayAvatarURL({ dynamic: true }))

      .setFooter({ text:  message.author.username, iconURL: message.author.avatarURL({dynamic: true})})
      .setTimestamp()

  message.channel.send({embeds: [embed]})
  }
}
