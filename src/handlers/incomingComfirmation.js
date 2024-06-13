const { EmbedBuilder } = require("discord.js")
const express = require('express');
const log = require("./../utils/log")
require("dotenv").config()

const PORT = 4096;
const app = express();

module.exports = (client) => {
    app.use(express.json());

    app.post('/', (req, res) => {
        const { token , channelid, messageid, statusCode, statusMessage } = req.body;

        if (token == process.env.RMSP_TOKEN) {
            client.channels.cache.get(channelid).messages.fetch(messageid)
            .then(Message => {
                const embed = new EmbedBuilder()
                .setTitle("RMSP Protocol | Status")
                .setColor("#00ff00")
                .setTimestamp()
                .addFields(
                    { name: "Status", value: "Reviced confirmation from Roblox Server(s)!" },
                    { name: "Responds", value: `${statusCode} ${statusMessage}`},
                )
                Message.edit({embeds: [embed]})

                ResponseBack = JSON.stringify({
                    statusCode: "200",
                    statusMessage: "OK"
                })
                res.send(ResponseBack);
            })
            .catch(error => {
                log(error);
                ResponseBack = JSON.stringify({
                    statusCode: "500",
                    statusMessage: "Internal Server Error"
                })
                res.send(ResponseBack);
            });
        } else {
            ResponseBack = JSON.stringify({
                statusCode: "403",
                statusMessage: "Forbidden"
            })
            res.send(ResponseBack);
        }
    });

    // Start the server
    app.listen(PORT, () => {
    log(`listening on port ${PORT}`);
    });
};