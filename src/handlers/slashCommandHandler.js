const { Events, Collection } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(ctx) {
        if (!ctx.isChatInputCommand()) return;
    
        const command = ctx.client.commands.get(ctx.commandName);

        if (!command) {
            console.warn(`[Stratice] [BOT]: [WARN] Could not find command matching name ${ctx.commandName}`);
            return;
        };

        const { cooldowns } = ctx.client;

        if (!cooldowns.has(command.data.name)) {
            cooldowns.set(command.data.name, new Collection());
        };

        const now = Date.now();
        const timestamps = cooldowns.get(command.data.name);
        const defaultCooldown = 3;
        const cooldownAmount = (command.cooldown ?? defaultCooldown) * 1000;

        if (timestamps.has(ctx.user.id)) {
            const expTime = timestamps.get(ctx.user.id) + cooldownAmount;

            if (now < expTime) {
                const expTimestamp = Math.round(expTime / 1000);
                return ctx.reply({ content: `Please wait. You are on a command cooldown for \`${command.data.name}\`. You can try this command again in <t:${expTimestamp}:R>`, ephemeral: true });
            };
        };

        timestamps.set(ctx.user.id, now);
        setTimeout(() => timestamps.delete(ctx.user.id), cooldownAmount)

        try {
            await command.execute(ctx);
        } catch (err) {
            console.error(`[Stratice] [BOT]: [ERROR] ${err}`);
            if (ctx.replied || ctx.deferred) {
                await ctx.followUp({ content: 'There was an issue while processing this command. Please raise a ticket on the AviLab help portal.', ephemeral: true });
            } else {
                await ctx.reply({ content: 'There was an issue while processing this command. Please raise a ticket on the AviLab help portal.', ephemeral: true });
            };
        };
    },
};