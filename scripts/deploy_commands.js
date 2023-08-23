const { REST, Routes } = require("discord.js");
const { token, guildId, clientId } = require('../config.json');
const fs = require("node:fs");
const path = require("node:path");

const commands = [];

const foldersPath = path.join(__dirname, '..', 'src', 'lib', 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
            console.log(`[Startice] [SCRIPT]: [Commands] Loaded ${command.data.name} command`);
        } else {
            console.log(`[Stratice] [SCRIPT]: [WARN] ${filePath} is missing a required property.`)
        };
    }
}

const rest = new REST().setToken(token);

(async () => {
    try {
        console.log(`[Stratice] [SCRIPT]: [Commands] Started refreshing ${commands.length} application (/) commands`);

        const data = await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log(`[Stratice] [SCRIPT]: [Commands] Sucessfully reloaded ${data.length} application commands`)
        console.log(`[Stratice] [SCRIPT]: [Commands] ${commands.length-data.length} commands were missed`)
    } catch (err) {
        console.error(`[Stratice] [SCRIPT]: [ERROR] ${err}`)
    }
})();