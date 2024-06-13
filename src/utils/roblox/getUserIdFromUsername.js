const axios = require("axios")
const log = require("../log")
require("dotenv").config()

module.exports = async (name) => {
    try {
        const response = await axios.post(`https://users.roblox.com/v1/usernames/users`, {
            "usernames": [name],
            "excludeBannedUsers": true
        })
        const data = response.data.data[0];
        return data.id
        }
        catch(err){
            log(`There was an error! \n \n ${err}`)
            return
        }
}