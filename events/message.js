const Discord = require("discord.js");
const fs = require("fs");
const dateFormat = require("dateformat");

module.exports = async (bot, message) => {

    let prefix = "!";
    const args = message.content.split(/ +/g);
    const command = args.shift().slice(prefix.length).toLowerCase();
    const cmd = bot.commands.get(command) || bot.aliases.get(command);

    guildSupport = bot.guilds.cache.find(c => c.id === bot.config.serverID);
    if(!guildSupport) return console.log(`No valid server has been defined as support server.`);

    ///////////////////////////// MOD MAIL FUNCTIONS //////////////////////////////////

                let auteurRep = new Discord.MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                .setColor(bot.color.none)

                let pleaseWait = new Discord.MessageEmbed()
                .setAuthor(`⏳ | Please Wait`)
                .setDescription(`Your reply has been sent. We will therefore ask you to wait until a member of our team is available to send you a reply.`)
                .setTimestamp()

                let newSupport = new Discord.MessageEmbed()
                .setAuthor(`📨 | Ticket Open`)
                .setColor(bot.color.blue)
                .setTimestamp()
                .setThumbnail(message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                .setDescription(`A user has opened a request and is waiting for your response.`)
                .addField(`User Information`, [
                    `❱ Tag : \`${message.author.tag}\``,
                    `❱ ID : \`${message.author.id}\``,
                    `❱ Account Creation : \`${dateFormat(new Date(), "dd/mm/yyyy")}\``
                ]);

                let successRep = new Discord.MessageEmbed()
                .setAuthor(`🎫 | Ticket Open`)
                .setColor(bot.color.blue)
                .setDescription(`Your message has been sent. \nPlease wait. A member of our team will get back to you shortly.`);
                
                if(message.content.length > 0) auteurRep.setDescription(message.content);

        if(message.channel.type === "dm" && !message.author.bot && message.attachments.size > 0) {

            let Attachment = (message.attachments).array();
                    
            if(Attachment[0].url.toUpperCase().endsWith('.PNG') || Attachment[0].url.toUpperCase().endsWith('.JPG') || Attachment[0].url.toUpperCase().endsWith('.JPEG') || Attachment[0].url.toUpperCase().endsWith('.WEBP')){
                    
                    auteurRep.setImage(Attachment[0].url);
                    
                    if(guildSupport.channels.cache.find(c => c.topic === message.author.id)){

                        message.channel.send({ embed: pleaseWait }).then(m => m.delete({timeout: 7000})).catch(e => {return bot.functions.error(guildSupport.channels.cache.find(c => c.topic === message.author.id), "The user does not receive the messages, please inform him/her.")});
                        guildSupport.channels.cache.find(c => c.topic === message.author.id).send(auteurRep).catch(e => {return bot.functions.error(message.channel, `Sorry, your message could not be sent. Please contact an administrator.`)});

                    } else {

                let categorie = guildSupport.channels.cache.find(c => c.name == "ModMail" && c.type == "category");
                if(!categorie) categorie = await guildSupport.channels.create("ModMail", {type: "category", position: 1}).catch(e => {return console.error(e)});

                guildSupport.channels.create(`mp-${message.author.username}`, { permissionOverwrites:[
                    {
                      deny: 'VIEW_CHANNEL',
                      id: guildSupport.id
                    },
                    {
                      allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS'],
                      id: role.id
                    },
                  ],
                  parent: categorie.id,
                  reason: `This user needs help.`,
                  topic: `${message.author.id}`
                }).then(channel => {
                  channel.send(`${role}`, {embed: newSupport});
                  channel.send(auteurRep);
                  message.author.send(successRep).catch(e => {return bot.functions.error(channel, "The user does not receive the messages.")});
                }).catch(e => {return console.error(e)});

                    }
                            
            } else {

                if(guildSupport.channels.cache.find(c => c.topic === message.author.id)){

                    mc = "*The user sent you a file, here it is:*";
                    if(message.content.length > 0) mc = `${message.content}\n\n*The user sent you a file, here it is:*`;

                    message.channel.send({ embed: pleaseWait }).then(m => m.delete({timeout: 7000})).catch(e => {return bot.functions.error(guildSupport.channels.cache.find(c => c.topic === message.author.id), "The user does not receive the messages, please inform him/her.")});
                    guildSupport.channels.cache.find(c => c.topic === message.author.id).send(auteurRep.setDescription(mc)).catch(e => {return bot.functions.error(message.channel, `Sorry, your message could not be sent. Please contact an administrator.`)});
                    guildSupport.channels.cache.find(c => c.topic === message.author.id).send(Attachment[0]).catch(e => {return bot.functions.error(message.channel, `Sorry, your message could not be sent. Please contact an administrator.`)});

                } else {

                let role = guildSupport.roles.cache.find(r => r.name === "ModMail Support");
                if(!role) {
                    guildSupport.roles.create({data:{name: "ModMail Support", permissions: 0}, reason: 'The staff needs this role to see the tickets.'});
                    message.channel.send(`Please resend the message.`).then(m => m.delete({timeout: 5000}).catch(e => {}));
                    return;
                }

                let categorie = guildSupport.channels.cache.find(c => c.name == "ModMail" && c.type == "category");
                if(!categorie) categorie = await guildSupport.channels.create("ModMail", {type: "category", position: 1}).catch(e => {return console.error(e)});

                guildSupport.channels.create(`mp-${message.author.username}`, { permissionOverwrites:[
                    {
                      deny: 'VIEW_CHANNEL',
                      id: guildSupport.id
                    },
                    {
                      allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS'],
                      id: role.id
                    },
                  ],
                  parent: categorie.id,
                  reason: `This user needs help.`,
                  topic: `${message.author.id}`
                }).then(channel => {
                  channel.send(`${role}`, {embed: newSupport});
                  channel.send(auteurRep.setDescription(mc));
                  channel.send(Attachment[0]);
                  message.author.send(successRep).catch(e => {return bot.functions.error(channel, "The user does not receive the messages.")});
                }).catch(e => {return console.error(e)});

                }

            }

            return;

        }

        //////

        if(message.channel.type === "dm" && message.content.length > 0 && !message.author.bot){

            if(message.content === 'clear please'){
                const params = '99';
                  let messagecount = parseInt(params[0]);
                  message.channel.messages.fetch({
                      limit: 100
                    })
                    .then(messages => {
                      let msg_array = messages.array();
                      msg_array = msg_array.filter(m => m.author.id === bot.user.id);
                      msg_array.length = messagecount + 1;
                      msg_array.map(m => m.delete().catch(console.error));
                    }).catch(e => {console.log(e)});
                    return;
              }

            if(guildSupport.channels.cache.find(c => c.topic === message.author.id)){

                message.channel.send({ embed: pleaseWait }).then(m => m.delete({timeout: 7000})).catch(e => {return bot.functions.error(guildSupport.channels.cache.find(c => c.topic === message.author.id), "The user does not receive the messages, please inform him/her.")});
                guildSupport.channels.cache.find(c => c.topic === message.author.id).send(auteurRep).catch(e => {return bot.functions.error(message.channel, `Sorry, your message could not be sent. Please contact an administrator.`)});

            } else {

                let role = guildSupport.roles.cache.find(r => r.name === "ModMail Support");
                if(!role) {
                    guildSupport.roles.create({data:{name: "ModMail Support", permissions: 0}, reason: 'The staff needs this role to see the tickets.'});
                    message.channel.send(`Please resend the message.`).then(m => m.delete({timeout: 5000}).catch(e => {}));
                    return;
                }

                let categorie = guildSupport.channels.cache.find(c => c.name == "ModMail" && c.type == "category");
                if(!categorie) categorie = await guildSupport.channels.create("ModMail", {type: "category", position: 1}).catch(e => {return console.error(e)});

                guildSupport.channels.create(`mp-${message.author.username}`, { permissionOverwrites:[
                    {
                      deny: 'VIEW_CHANNEL',
                      id: guildSupport.id
                    },
                    {
                      allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS'],
                      id: role.id
                    },
                  ],
                  parent: categorie.id,
                  reason: `This user needs help.`,
                  topic: `${message.author.id}`
                }).then(channel => {
                  channel.send(`${role}`, {embed: newSupport});
                  channel.send(auteurRep);
                  message.author.send(successRep).catch(e => {return bot.functions.error(channel, "The user does not receive the messages.")});
                }).catch(e => {return console.error(e)});

            }

        }

        ///////

        if(message.channel.type !== "dm" && !message.author.bot && message.channel.name.startsWith(`mp-`) && !cmd){

            let user = message.guild.members.cache.find(m => m.id === message.channel.topic);
            if(!user) return bot.functions.error(message.channel, "Unable to find the user.");
            
            if(message.attachments.size > 0) {


                let Attachment = (message.attachments).array();    
                if(Attachment[0].url.toUpperCase().endsWith('.PNG') || Attachment[0].url.toUpperCase().endsWith('.JPG') || Attachment[0].url.toUpperCase().endsWith('.JPEG') || Attachment[0].url.toUpperCase().endsWith('.WEBP')){

                    let auteurRepFix = new Discord.MessageEmbed()
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                    .setColor(bot.color.none)
                    .setImage(Attachment[0].url);
                    if(message.content.length > 0) auteurRepFix.setDescription(message.content)
                    
                    await message.channel.send(auteurRepFix);
                    await user.send(auteurRepFix).catch(e => {return bot.functions.error(message.channel, "Unable to send the message to the requester.")});
                    if(message.deletable) await message.delete().catch(e => {});
                    return;

                } else {

                    mc = "*The user sent you a file, here it is:*";
                    if(message.content.length > 0) mc = `${message.content}\n\n*The user sent you a file, here it is:*`;
    
                    await message.channel.send(auteurRep.setDescription(mc));
                    await message.channel.send(Attachment[0]);
                    await user.send(auteurRep.setDescription(mc)).catch(e => {return bot.functions.error(message.channel, "Unable to send the message to the requester.")});
                    await user.send(Attachment[0]).catch(e => {return bot.functions.error(message.channel, "Unable to send the message to the requester.")});
                    if(message.deletable) await message.delete().catch(e => {});
                    return;
                }
    
            }

            if(message.content.length > 0){
            message.channel.send(auteurRep);
            user.send(auteurRep).catch(e => {return bot.functions.error(message.channel, "Unable to send the message to the requester.")});
            if(message.deletable) await message.delete().catch(e => {});
            }

        }

    ///////////////////////////////////////////////////////////////////////////////////

    if(!message.content.toLowerCase().startsWith(prefix) || !message.guild || message.author.bot || !cmd) return;
    if(cmd.requirements.botOwner && cmd.requirements.botOwner === true && !bot.owners.includes(message.author.id)) return bot.functions.error(message.channel, "Sorry, only the bot developer is allowed to use this command.")
    if(cmd.requirements.botPerms && cmd.requirements.botPerms.length > 0 && !message.guild.me.hasPermission(cmd.requirements.botPerms)) return bot.functions.error(message.channel, `Sorry, I don't have permissions \`${message.guild.me.permissions.missing(cmd.requirements.botPerms).join(", ").replace(/_/gi, " ")}\`.`);
    if(cmd.requirements.userPerms && cmd.requirements.userPerms.length > 0 && !message.member.hasPermission(cmd.requirements.userPerms)) return bot.functions.error(message.channel, `Sorry, you don't have permissions \`${message.member.permissions.missing(cmd.requirements.userPerms).join(", ").replace(/_/gi, " ")}\`.`);

    cmd.run(bot, message, args).catch(e => {return console.log(e)});

} 