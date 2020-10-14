const Discord = require("discord.js");
const bot = new Discord.Client({
    disableEveryone: true,
    autoReconnect: true,
    disabledEvents: ["TYPING_START"],
    partials: ['MESSAGE', 'CHANNEL', 'GUILD_MEMBER', 'REACTION']
  });

const loadCommands = require("./functions/commands.js");
const loadEvents = require("./functions/events.js");

bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
bot.event = new Discord.Collection();

bot.config = require("./Storage/config.json");
bot.color = require("./Storage/color.json");
bot.functions = require("./functions/functions.js");
bot.owners = bot.config.owners

const load = async () => {
    await loadCommands.run(bot);
    await loadEvents.run(bot);
}

load();
bot.login(bot.config.token);