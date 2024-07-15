const { interaction, PermissionFlagsBits, Client, IntentsBitField, EmbedBuilder, Guild, ApplicationCommandOptionType } = require("discord.js")
const Configs = require("../../../config.json");
const log = require("../../utils/log")
const rmsp = require("../../utils/rmsp")
const getEntry = require("../../utils/roblox/getEntry")

module.exports = {
    name: 'shutdown',
    description: "shutdown game server(s)",
    // devOnly: Boolean,
    // testOnly: Boolean,
    options: [
        {
            name: "mode",
            description: "Shutdown Mode",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: 'Soft Shutdown',
                    value: 'softshutdown'
                },
                {
                    name: 'Normal Shutdown',
                    value: 'shutdown'
                },
            ]
        }
    ],
    // deleted: Boolean,
    // permissionsRequired: [PermissionFlagsBits.Administrator],
    // botPermissions: [PermissionFlagsBits.Administrator],
    callback: async (client, interaction) => {
        try {
            if (interaction.member.roles.cache.has(Configs.LGDEV_ROLEID)) {
                const openservers = await getEntry("OpenServers", 123);
                if (openservers >= 1) {
                    const username = interaction.user.username
                    const userid = interaction.user.id
                    const mode = interaction.options.get("mode").value

                    await rmsp(interaction, "shutdown", mode)

                    // Logging
                    const embed = new EmbedBuilder()
                        .setTitle("LG Manager Log: Command Executed")
                        .setColor("#fabe00")
                        .setDescription("**Command:** shutdown")
                        .setTimestamp()
                        .addFields(
                            { name: "Options", value: `**Mode:** ${mode}`, inline: false },
                            { name: "Requestor", value: `**Username:** ${username}\n**UserId:** ${userid}`, inline: false },
                        )
                    const channel = client.channels.cache.get(Configs.LOG_CHANNEL);
                    channel.send({ embeds: [embed] });
                } else {
                    interaction.reply({
                      content: 'No Server is open!',
                      ephemeral: true
                    });
                }
            } else {
                interaction.reply({
                    content: 'You dont have permission to run this command!',
                    ephemeral: true
                });
            }
        } catch (error) {
            log(error);
            interaction.reply({
                content: 'There was an error! It has been logged. Please DM M23__ and notify them of the issue!',
                ephemeral: true
            });
        }
    },
};