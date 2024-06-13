const axios = require("axios");
const log = require("../log");
require("dotenv").config();

module.exports = async (userId) => {
    try {
        const response = await axios.get(`https://users.roblox.com/v1/users/${userId}`);
        const data = response.data;
        return data.name;
    } catch (err) {
        log(`Error fetching username for user ID ${userId}: ${err.message}`);
        return undefined;
    }
};