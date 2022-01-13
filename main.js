// discord boiler plate

const request = require("request");
require('dotenv').config();

const Discord = require("discord.js");
// const res = require("express/lib/response");
const client = new Discord.Client({
    allowedMentions: {
        parse: ['users', 'roles'],
        repliedUser: true,
    },
    intents: [
        "GUILDS",
        "GUILD_MESSAGES",
        "GUILD_PRESENCES",
        "GUILD_MEMBERS",
        "GUILD_MESSAGE_REACTIONS"
    ]
});
//=======================================================


client.on("ready",  () => {
    console.log("Bot is ready");
});


client.on("message", async msg => {
    if (msg.content === "$help") {
        msg.channel.send(`To the get the price of coin please enter dollar symbol followed by name of coin \nex. $bitcoin`);
    }

    if (msg.content === "$list") {
        request('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids', { json: true }, (err, res, body) => {
            for (var i = 0; i < res.body.length; i++) {
                msg.channel.send(`${res.body[i].id} => $${res.body[i].current_price}`)
            }    
        });
    }

    if (msg.content[0] === "$" || msg.content[0] === "#") {
        const key1 = msg.content.substring(1).toLowerCase();
    
        // all cryptos in
        // gets a list of all the crypto coins in the API 
    
        var ids = [];
        request('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids', { json: true }, (err, res, body) => {

            for (var i = 0; i < res.body.length; i++) {
                ids.push(res.body[i].id);
            }

            if (!ids.includes(key1)) { "not found" };
        
            if (ids.includes(key1)) {

                request('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=' + key1, { json: true }, (err, res, body) => {
                    if (err) { return console.log(err); }
            
                    const data = res.body;
                    const name = data[0].id; // name 
                    console.log(name);
                    const price = data[0].current_price;
                    
                    if (msg.content[0] === "$") { msg.channel.send(`Current price = $${price}`) };
                    if (msg.content[0] === "#") { msg.channel.send(`24h High = $${data[0].high_24h}\n24 Low =$${data[0].low_24h}`)}; 
                });
            }
        });
    }
});


// token code
client.login(process.env.TOKEN);