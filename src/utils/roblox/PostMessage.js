const axios = require('axios').default
const log = require("../log")
const Configs = require("../../../config.json");

module.exports.MessageSend = async function MessageSend(Message, Topic) {

    const response = await axios.post(
        `https://apis.roblox.com/messaging-service/v1/universes/${Configs.UNIVERSE_ID}/topics/${Topic}`,
        {
            'message': Message
        },
        {
            headers: {
                'x-api-key': process.env.ROBLOXAPI,
                'Content-Type': 'application/json'
            }
        }
    ).catch(err =>{
        log(err.response.data)
        if (err.response.status == 401) return "ERROR: API key not valid for operation, user does not have authorization"
        if (err.response.status == 403) return "ERROR: Publish is not allowed on universe."
        if (err.response.status == 500) return "ERROR: Server internal error / Unknown error."
        if (err.response.status == 400){
            if (err.response.data == "requestMessage cannot be longer than 1024 characters. (Parameter 'requestMessage')") return "ERROR: The request message cannot be longer then 1024 characters long."
            log(err.response.data)
        }
  })
    if (response){
        if (response.status == 200) return 200
        log(err.response.data)
        if (response.status != 200) return "ERROR: An unknown issue has occurred."
    }
}