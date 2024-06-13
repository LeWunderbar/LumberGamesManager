const { interaction, Client, IntentsBitField, EmbedBuilder, Guild, ApplicationCommandOptionType, CommandInteractionOptionResolver } = require("discord.js")
const Configs = require("../../../config.json");
const log = require("../../utils/log")
const getEntry = require("../../utils/roblox/getEntry")
const getUserId = require("../../utils/roblox/getUserIdFromUsername")
const getUsernameFromUserId = require("../../utils/roblox/getUsernameFromUserId")

function findUserByUsername(data, targetUsername) {
    for (let i = 0; i < data.length; i++) {
      const userArray = data[i];
      if (userArray[0] == targetUsername) {
        return userArray;
      }
    }
    return null;
}
  
module.exports = {
    name: 'baninfo',
    description: 'Get ban infomation of a banned LG Player',
    // devOnly: Boolean,
    // testOnly: Boolean,
    options: [
        {
            name: "robloxuser",
            description: "Username of the person you want to see the ban info off",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    // deleted: Boolean,
    // permissionsRequired: [PermissionFlagsBits.],
    // botPermissions: 
    callback: async (client, interaction) => {
        try {
            if (interaction.member.roles.cache.has(Configs.LGDEV_ROLEID)) {
                const Username = interaction.options.get("robloxuser").value
                const UserId = await getUserId(Username)

                if (UserId == undefined) {
                    interaction.reply({
                        content: 'Cannot find UserId of provided username! Is the username Valid?',
                        ephemeral: true
                    });
                    return
                }

                const BanData = await getEntry("BanDatav1", 123);
                if (BanData == undefined) {
                    interaction.reply({
                        content: 'No Ban data found! Please Report this to a developer!',
                        ephemeral: true
                    });
                    return
                }

                const UserBanData = findUserByUsername(BanData, UserId)
                if (UserBanData == null) {
                    interaction.reply({
                        content: 'Provided User is not banned!',
                        ephemeral: true
                    });
                    return
                }

                const ModUserId = UserBanData[3]
                let ModString = ""

                if (ModUserId == "Server" || ModUserId == "server") {
                    ModString = "Server"
                } else if (ModUserId == "Old System: No moderator logged") {
                    ModString = "Not Logged!"
                } else {
                    const ModUsername = await getUsernameFromUserId(ModUserId)

                    if (ModUsername == undefined) {
                        ModString = `<Error Fetching Username> (${ModUserId})`
                    } else {
                        ModString = `${ModUsername} (${ModUserId})`
                    }
                }

                const embed = new EmbedBuilder()
                    .setTitle(`Lumber Games ban data of ${Username} (${UserId})`)
                    .setColor("#2f7dde")
                    .setThumbnail("https://cdn.discordapp.com/attachments/844638877923016714/1005925239919751338/unknown.png")
                    .setTimestamp()
                    .addFields(
                        { name: "**Reason**", value: UserBanData[1], inline: true },
                        { name: "**Data**", value: UserBanData[2], inline: true },
                        { name: "**Moderator**", value: ModString, inline: true },
                    )
                    interaction.reply({ content: `Requested Ban Data:`, embeds: [embed] });
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