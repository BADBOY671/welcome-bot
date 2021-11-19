const express = require('express')
const app = express()
const Discord = require('discord.js')
const client = new Discord.Client()
const db = require('quick.db')

const prefix = "+"

client.on('ready', async () => {
  console.clear()
await console.log(`i\'m Ready`)
})

client.on('message', async message => {
      if(message.content.startsWith(prefix + 'set-channel')){
    if (!message.guild.member(message.author).hasPermission("ADMINISTRATOR")) return

    let args = message.content.split(' ')

    let ch = message.mentions.channels.first() || client.channels.cache.get(args[1])
    if(!ch) return message.channel.send(`**Usage:**
${prefix}set-welcome [ Channel ]`)

db.set(`wlc_${message.guild.id}`, ch)
message.channel.send(`تم تغير غرفة الترحيب الى \`${ch.name}\` `)

  }

    if(message.content.startsWith(prefix + 'welcome')){
    if (!message.guild.member(message.author).hasPermission("ADMINISTRATOR")) return

    let args = message.content.split(' ').slice(1).join(' ')
    if(!args) return message.channel.send(`${prefix}welcome [ on / off ]`)

    if(args === 'on'){
      db.set(`toggle_${message.guild.id}`, true)
      await message.channel.send('تم تفعيل وضع الترحيب')
    }else if(args === 'off'){
      db.delete(`toggle_${message.guild.id}`)
      await message.channel.send('تم ايقاف وضع الترحيب')
    }
  }

  if(message.content.startsWith(prefix + 'set-message')){
    if (!message.guild.member(message.author).hasPermission("ADMINISTRATOR")) return

    let args = message.content.split(' ').slice(1).join(' ')
    if(!args) return message.channel.send(`**Usage:**
${prefix}setMessage [ Message ]`)

db.set(`msg_${message.guild.id}`, args)
message.channel.send(`تم وضع رسالة ترحيب جديدة `)

  }

  if(message.content.startsWith(prefix + 'help')){

message.channel.send(new Discord.MessageEmbed().setAuthor(message.guild.name,message.guild.iconURL({dynamic: true})).setColor('5865F2').setThumbnail(client.user.avatarURL()).setDescription(`
\`\`\`md\n# Commands:\n\`\`\`
${prefix}set-message - لتعين رسالة الترحيب
${prefix}set-channel - لتعين روم الترحيب
${prefix}welcome [ on/off ] - لتفعيل وضع الترحيب او ايقافه
\`\`\`md\n#Methods:\n\`\`\`
[user] - منشن الشخص المُضاف
[userName] - اسم الشخص المُضاف بدون منشن
[memberCount] - عدد الاعضاء داخل السيرفر
[server] - اسم السيرفر
[inviter] - منشن الشخص الداعي
[inviterName] - اسم الشخص الداعي
`).setFooter(message.author.username,message.author.avatarURL({dynamic: true})).setTimestamp()
)

  }

})

const InvitesTracker = require('@androz2091/discord-invites-tracker');
const tracker = InvitesTracker.init(client, {
    fetchGuilds: true,
    fetchVanity: true,
    fetchAuditLogs: true
});

tracker.on('guildMemberAdd', (member, type, invite) => {
  if(db.has(`toggle_${member.guild.id}`) === true){
  if(member.user.bot) return;

let channel = db.get(`wlc_${member.guild.id}`).id
if(!channel) return;
let ch = client.channels.cache.find(c => c.id === channel)

let message = db.get(`msg_${member.guild.id}`)
if(!message) return;

let result = message.replace("[user]",member.user).replace("[userName]", member.user.username).replace('[server]', member.guild.name).replace('[memberCount]', member.guild.memberCount).replace('[inviter]', `<@${invite.inviter.id}>`)

let result2 = message.replace("[user]",member.user).replace("[userName]", member.user.username).replace('[server]', member.guild.name).replace('[memberCount]', member.guild.memberCount).replace('[inviter]', `<@${member.guild.ownerId}>`)

if(type === 'normal'){
   ch.send(result)
}
if(type === 'unknown'){
   ch.send(result2);
}
if(type === 'vanity'){
  ch.send(result2);
}
  }else return;
})




client.login(process.env.token)
