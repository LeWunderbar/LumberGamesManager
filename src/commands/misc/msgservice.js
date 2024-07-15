const { interaction, PermissionFlagsBits, Client, IntentsBitField, EmbedBuilder, Guild, ApplicationCommandOptionType } = require("discord.js")
const Configs = require("../../../config.json");
const log = require("../../utils/log")
const postMessage = require("../../utils/roblox/PostMessage")
const getEntry = require("../../utils/roblox/getEntry")

module.exports = {
    name: 'msgservice',
    description: "Send an message via Roblox's Messaging service!",
    // devOnly: Boolean,
    // testOnly: Boolean,
    options: [
       {
          name: "message",
          description: "message to send",
          type: ApplicationCommandOptionType.String,
          required: true,
       },
       {
         name: "topic",
         description: "The Topic of the message",
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
                const openservers = await getEntry("OpenServers", 123); 
                if (openservers >= 1) {
                    const username = interaction.user.username
                    const userid = interaction.user.id
                    const messageToSend = interaction.options.get("message").value
                    const topicToSend = interaction.options.get("topic").value

                    const MsgResponds = await postMessage.MessageSend(messageToSend, topicToSend)
                    if (MsgResponds != 200) {
                        interaction.reply({
                          content: 'There was an error! It has been logged. Please DM M23__ and notify them of the issue!',
                          ephemeral: true
                        });
                    } else {
                        interaction.reply({
                          content: 'Message sent!',
                          ephemeral: false 
                        });
                    }

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