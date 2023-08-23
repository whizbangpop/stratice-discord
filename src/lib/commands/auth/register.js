const { SlashCommandBuilder } = require("discord.js");
const Axios = require("axios");

module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName("register")
        .setDescription("Starts the registration process for Stratice."),
    async execute(ctx) {
        await ctx.deferReply();

        Axios.post('http://localhost:3000/reqgen/newauth', {
            user: {
                username: ctx.user.id
            }, 
            server: {
                id: ctx.guild.id
            },
        }, {
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            }
        })
        .then(async function(res) {
            await ctx.followUp({ content: `Please follow this URL to authenticate: ${res.data.authUrl}. Your unique Stratice UUID is \`${res.data.straticeUUID}\`` })
        })
    }
};