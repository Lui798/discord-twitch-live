const Discord = require("discord.js");
const config = require("./config.json");
const request = require("sync-request");
const webHook = new Discord.WebhookClient(config.webhookID, config.webhookToken);

var twitchURL = "https://api.twitch.tv/kraken/streams/" + config.userID + "?client_id=" + config.clientID;
var twitchJSON = getJSON(twitchURL);
var isLive = false;
var messageSent = false;

function getJSON(url) {
  return JSON.parse(request('GET', url, {retry: true}).getBody());
}

function checkIfLive() {
  twitchJSON = getJSON(twitchURL);
  if (twitchJSON.stream != null) {
    isLive = true;
  }
  else {
    isLive = false;
  }
}

function sendLiveMessage() {
  if (twitchJSON.stream != null) {
    if (twitchJSON.stream.channel.game === "") {
      twitchJSON.stream.channel.game = "No game set";
    }
    else if (twitchJSON.stream.channel.status === "") {
      twitchJSON.stream.channel.status = "No status set";
    }
    const embed = new Discord.RichEmbed()
      .setAuthor(twitchJSON.stream.channel.display_name, twitchJSON.stream.channel.logo)
      .setColor(0x6441A4)
      .setImage(`https://static-cdn.jtvnw.net/previews-ttv/live_user_${twitchJSON.stream.channel.name}-1152x648.jpg`)
      .setThumbnail(twitchJSON.stream.channel.logo)
      .addField("Title", twitchJSON.stream.channel.status)
      .addField("Game", twitchJSON.stream.channel.game)
      .addField("Link", twitchJSON.stream.channel.url);
    //webHook.send(`@everyone **${twitchJSON.stream.channel.display_name}** just went live! *${twitchJSON.stream.channel.status}* ${twitchJSON.stream.channel.url}`);
    webHook.send("", embed);
  }
  else {
    webHook.send(config.userID + " just went live! https://twitch.tv/" + config.userID);
  }
}

function app() {
  checkIfLive();
  console.log("Is live: " + isLive);
  if (isLive == true && messageSent == false) {
    sendLiveMessage();
    console.log("Discord message sent");
    messageSent = true;
  }
  else if (isLive == false) {
    messageSent = false;
  }
}

setInterval(app, 20000);
