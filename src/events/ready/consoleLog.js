const { Client, IntentsBitField, EmbedBuilder, Guild } = require("discord.js");
const configs = require("../../../config.json");
const log = require("../../utils/log");

// Define an array of activities
const activities = configs.BOT_STATUSOPTIONS

module.exports = (client) => {
    // Console Online logging
    const c = client;
    log('The Bot "' + c.user.tag + '" is now online!');

    // Bot Status
    let currentIndex = 0;
    const setActivity = () => {
        const activity = activities[currentIndex];
        c.user.setActivity({ name: activity });
        currentIndex = (currentIndex + 1) % activities.length;
    };
    setActivity();
    setInterval(() => {
        setActivity();
    }, 5000);

    // Discord Online Logging
    const embed = new EmbedBuilder()
        .setTitle("Online")
        .setColor("Green")
        .setAuthor({ name: "Bot: " + c.user.tag + " (" + c.user.id + ")", iconURL: c.user.avatarURL() });

    const channel = client.channels.cache.get(configs.LOG_CHANNEL);
    channel.send({ embeds: [embed] });
};