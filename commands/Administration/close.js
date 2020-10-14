const Discord = require("discord.js");
const functions = require("../../functions/functions");

exports.run = async (bot, message, args) => {

    if(message.channel.type !== "dm" && !message.author.bot && !message.channel.name.startsWith(`mp-`) && !isNaN(message.channel.topic)) return functions.error(message.channel, "This command can only be executed in a help room.");

    guildSupport = bot.guilds.cache.find(c => c.id === bot.config.serverID);
    if(!guildSupport) return console.log(`No valid server has been defined as support server.`);

    let ticketSupport = guildSupport.roles.cache.find(r => r.name === "ModMail Support");
    if(!ticketSupport) {
        guildSupport.roles.create({data:{name: "ModMail Support", permissions: 0}, reason: 'The staff needs this role to see the tickets.'});
        functions.error(message.channel, "The support role has just been created, please redo this command.");
        return;
    }

    if(!message.guild.member(message.author).roles.cache.has(ticketSupport.id)) return functions.error(message.channel, `The ${ticketSupport} role is required for this command.`);

    let user = bot.users.cache.find(u => u.id === message.channel.topic);
    if(!user) return functions.error(message.channel, "Unable to find this user.");

    let closeEmbed = new Discord.MessageEmbed()
    .setAuthor(`🗑️ | Ticket Done`)
    .setColor(bot.color.blue)
    .setTimestamp()
    .setFooter(`Resend a message to reopen a ticket.`)
    .setDescription(`Your ticket was closed by a member of our team. If you think he made a mistake, feel free to reopen it by sending a message in this private message room.`)
    .addField(`How do I delete all messages?`, [
        `You can delete all messages from the bot by sending : \`clear please.\``
    ]);

    user.send(closeEmbed)
    .then(m => {
        message.channel.delete().catch(e => {return functions.error(message.channel, "Impossible to delete this room.")});
    });
    
}

exports.help = {
    name: "close",
    aliases: [],
    category: "Utilities"
}

exports.requirements = {
    botOwner: false,
    botPerms: ['MANAGE_CHANNELS', 'MANAGE_ROLES'],
    userPerms: []
}