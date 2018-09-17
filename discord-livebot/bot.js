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
    webHook.send(`@everyone **${twitchJSON.stream.channel.display_name}** just went live! *${twitchJSON.stream.channel.status}* ${twitchJSON.stream.channel.url}`);
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
