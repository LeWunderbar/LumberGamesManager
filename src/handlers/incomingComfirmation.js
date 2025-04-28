const { EmbedBuilder } = require("discord.js");
const express = require('express');
const rateLimit = require('express-rate-limit');
const log = require("./../utils/log");
require("dotenv").config();

const PORT = 4096;
const app = express();

module.exports = (client) => {
    app.use(express.json());

    // Rate limiting middleware
    const limiter = rateLimit({
        windowMs: 60 * 1000, // 1 minute
        max: 60,
        standardHeaders: true, 
        legacyHeaders: false,
    });
    app.use(limiter);

    app.post('/', async (req, res) => {
        const { token, channelid, messageid, statusCode, statusMessage } = req.body;

        // Validate token
        if (token !== process.env.RMSP_TOKEN) {
            return res.status(403).json({
                statusCode: "403",
                statusMessage: "Forbidden",
            });
        }

        // Validate IDs (Discord Snowflakes: 17-19 digit numbers)
        const snowflakeRegex = /^\d{17,19}$/;
        if (!snowflakeRegex.test(channelid) || !snowflakeRegex.test(messageid)) {
            return res.status(400).json({
                statusCode: "400",
                statusMessage: "Invalid channel or message ID",
            });
        }

        try {
            const channel = client.channels.cache.get(channelid);
            if (!channel) {
                return res.status(404).json({
                    statusCode: "404",
                    statusMessage: "Channel not found",
                });
            }

            const message = await channel.messages.fetch(messageid);

            const embed = new EmbedBuilder()
                .setTitle("RMSP Protocol | Status")
                .setColor("#00ff00")
                .setTimestamp()
                .addFields(
                    { name: "Status", value: "Received confirmation from Roblox Server(s)!" },
                    { name: "Response", value: `${statusCode} ${statusMessage}` },
                );

            await message.edit({ embeds: [embed] });

            return res.status(200).json({
                statusCode: "200",
                statusMessage: "OK",
            });

        } catch (error) {
            log(error); // Only internal logging
            return res.status(500).json({
                statusCode: "500",
                statusMessage: "Internal Server Error",
            });
        }
    });

    // Start the server
    app.listen(PORT, () => {
        log(`Listening on port ${PORT}`);
    });
};
