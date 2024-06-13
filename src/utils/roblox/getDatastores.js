const axios = require("axios")
const log = require("../log")
const Configs = require("../../../config.json");
require("dotenv").config()

module.exports = (cursor, limit, prefix) => {
    return axios.get(`https://apis.roblox.com/datastores/v1/universes/${Configs.UNIVERSE_ID}/standard-datastores`, {
        params: {
            "cursor": cursor,
            "limit": limit,
            "prefix": prefix,
        },
        headers: {
            "x-api-key": process.env.ROBLOXAPI
        }
    }).then(response => {
        return response.data
    }).catch(err => {
        log(`There was an error! \n \n ${err}`)
        return null
    })
}