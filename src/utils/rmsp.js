const { interaction, PermissionFlagsBits, Client, IntentsBitField, EmbedBuilder, Guild, ApplicationCommandOptionType } = require("discord.js")
const log = require("../utils/log")
const postMessage = require("../utils/roblox/PostMessage")
const getEntry = require("../utils/roblox/getEntry")

const Configs = require("../../config.json");
require("dotenv").config()

function MakeEmbed(embedType, op1) {
    let embed
    if (embedType == "init") {
        embed = new EmbedBuilder()
            .setTitle("RMSP Protocol | Status")
            .setColor("#ffeb00")
            .setTimestamp()
            .addFields(
                { name: "Status", value: "Sending Message to Roblox Server(s)..." },
            )
    } else if (embedType == "errorBot") {
        embed = new EmbedBuilder()
            .setTitle("RMSP Protocol | ERROR")
            .setColor("#ff0000")
            .setTimestamp()
            .addFields(
                { name: "Note", value: "There was an internal error on the bot side! It has been logged. Please DM M23__ and notify them of the issue!"},
                { name: "Error Code", value: op1 },

            )
    } else if (embedType == "sent") {
        embed = new EmbedBuilder()
            .setTitle("RMSP Protocol | Status")
            .setColor("#ffeb00")
            .setTimestamp()
            .setFooter({text: "If this message stays for longer than about 30 sec, then the response most likely failed or there was an error with the receiver! The Error has been logged!"})
            .addFields(
                { name: "Status", value: "Sent Message to ROBLOX Server(s)! Awaiting Responds..." },
            )
    } else if (embedType == "servers0") {
        embed = new EmbedBuilder()
        .setTitle("RMSP Protocol | ERROR")
        .setColor("#ff0000")
        .setTimestamp()
        .addFields(
            { name: "Error", value: "There is no game server open!"},
            { name: "Error Code", value: "No GameServer" },
        )
    }
    return embed
}

module.exports = async (interaction, OpType, Parameter) => {
    try {
        const openservers = await getEntry("OpenServers", 123); 
        const username = interaction.user.username
        const userid = interaction.user.id

        if (openservers == 0) {
            interaction.reply({
                ephemeral: true,
                embeds: [MakeEmbed("servers0")],
            });
        } else {
            // Send Init Msg
            let reply = await interaction.reply({
                ephemeral: false,
                embeds: [MakeEmbed("init")],
                fetchReply: true
            });

            // Get Message ID and Channel ID, and make json
            const dataToSend = {
                Op_type: OpType,
                Parameter: Parameter,
                Username: username,
                Userid: userid,
                Channelid: reply.channelId,
                Messageid: reply.id,
            }
            const JsonDataToSend = JSON.stringify(dataToSend)

            // Send Json with MsgService and await responds
            const MsgResponds = await postMessage.MessageSend(JsonDataToSend, "LGManager_Operation")   
            if (MsgResponds != 200) {
                interaction.editReply({
                    embeds: [MakeEmbed("errorBot", "Not 200")],
                    ephemeral: true
                });
                log(`There was an error! \n \n "NOT 200! In RMSP.JS"`)
            } else {
                interaction.editReply({
                    embeds: [MakeEmbed("sent")],
                    ephemeral: false,
                });
            }
        }
    }
    catch(err){
        interaction.editReply({
            embeds: [MakeEmbed("errorBot", "SeeLogError1")],
            ephemeral: true
        });
        log(`There was an error! \n \n ${err}`)
        return
    }
};