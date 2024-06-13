//////////////////////////
// Imports of Index.js //
/////////////////////////

const { Client, IntentsBitField } = require('discord.js');
const eventHandler = require('./handlers/eventHandler');
const incomingComfirmation = require('./handlers/incomingComfirmation');
const log = require("./utils/log")
require("dotenv").config()

///////////////////////////
// Configs of the client //
///////////////////////////

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});


////////////////
// Launch Bot //
////////////////

console.clear();
console.log(`
    ██╗      ██████╗ ██╗   ██╗    ███╗   ███╗██████╗ ██████╗
    ╚██╗     ██╔══██╗╚██╗ ██╔╝    ████╗ ████║╚════██╗╚════██╗
     ╚██╗    ██████╔╝ ╚████╔╝     ██╔████╔██║ █████╔╝ █████╔╝
     ██╔╝    ██╔══██╗  ╚██╔╝      ██║╚██╔╝██║██╔═══╝  ╚═══██╗
    ██╔╝     ██████╔╝   ██║       ██║ ╚═╝ ██║███████╗██████╔╝
    ╚═╝      ╚═════╝    ╚═╝       ╚═╝     ╚═╝╚══════╝╚═════╝                                                
`);

(async () => {
  try {

    // Bot Setup
    incomingComfirmation(client)
    eventHandler(client);
    client.login(process.env.TOKEN);
  } catch (error) {
    log(`There was an error! \n \n ${error}`)
  }
})();
