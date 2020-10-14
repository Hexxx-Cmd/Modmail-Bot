const Discord = require("discord.js");

module.exports = async (bot) => {

    bot.user.setActivity(`Private messages.`, { type: "WATCHING" })
    console.log(`${bot.user.username} is ready !`);

} 
