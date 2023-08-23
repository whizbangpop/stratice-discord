const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`[Stratice] [BOT]: [INFO] Connected to Discord as ${client.user.tag}`);
    },
};