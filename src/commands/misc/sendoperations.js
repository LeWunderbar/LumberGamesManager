const { interaction, PermissionFlagsBits, Client, IntentsBitField, EmbedBuilder, Guild, ApplicationCommandOptionType } = require("discord.js")
const Configs = require("../../../config.json");
const log = require("../../utils/log")
const rmsp = require("../../utils/rmsp")
const getEntry = require("../../utils/roblox/getEntry")

module.exports = {
    name: 'sendoperations',
    description: "Send an operation request to game server(s)",
    // devOnly: Boolean,
    // testOnly: Boolean,
    options: [
       {
          name: "operation_type",
          description: "The type of the operation",
          type: ApplicationCommandOptionType.String,
          required: true,
       },
       {
         name: "parameter",
         description: "Parameter for the operation",
         type: ApplicationCommandOptionType.String,
         required: true,
      },
    ],
    // deleted: Boolean,
    // permissionsRequired: [PermissionFlagsBits.Administrator],
    // botPermissions: 
    callback: async (client, interaction) => {
        try {
            if (interaction.member.roles.cache.has(Configs.LGDEV_ROLEID)) {
                  const username = interaction.user.username
                  const userid = interaction.user.id
                  const OpType = interaction.options.get("operation_type").value
                  const Parameter = interaction.options.get("parameter").value
                  

                  await rmsp(interaction, OpType, Parameter)

                  // Logging
                    const embed = new EmbedBuilder()
                    .setTitle("LG Manager Log: Command Executed")
                    .setColor("#fabe00")
                    .setDescription("**Command:** servermessage")
                    .setTimestamp()
                    .addFields(
                        { name: "Options", value: `**Message:** ${messageToSend}\n**Topic:** ${topicToSend}`, inline: false },
                        { name: "Requestor", value: `**Username:** ${username}\n**UserId:** ${userid}`, inline: false },
                    )
                    const channel = client.channels.cache.get(Configs.LOG_CHANNEL);
                    channel.send({ embeds: [embed] });
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