const fs = require("fs");
const Filter = require("bad-words");
const Discord = require("discord.js");
const express = require('express');
const app = express();

const filter = new Filter();
const bot = new Discord.Client();

app.use(express.static('public'));

let config = JSON.parse(fs.readFileSync("config.json"));

function updateConfig(){
   fs.writeFile('config.json', JSON.stringify(config), (err) => {
		console.log(err ? err : "Config file updated.");
	});
}

function isAdmin(authorID){
   if (config.admins.indexOf(authorID) !== -1) return true;
   return false;
}

bot.on('message', (message) => {

   if (message.channel.name === undefined && !message.author.bot){

      if (message.content.toLowerCase().startsWith("!channel")){

         const args = message.content.slice(8);

         if (args === "" || !isAdmin(message.author.id)) return;

         config.channel = args.trim();

         message.author.send("Channel ID now set to: " + config.channel);

         updateConfig();
         return;
      }

      bot.channels.get(config.channel).send(filter.clean(message.content));
      
   }
});

bot.on('ready', () => {
   console.log("single, and ready to mingle!");
});

bot.login(process.env.TOKEN)
   .catch (error => {
      console.log(error);
   });

app.listen(process.env.PORT || 3000);