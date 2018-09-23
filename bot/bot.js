'use strict';

const Discord = require("discord.js");
const config = require("../config.json");
const request = require("sync-request");
const client = new Discord.Client();

console.log(process.argv[2]);
if (process.argv[2] != undefined) {
  config.userID = process.argv[2];
}

client.on("ready", () => {

  let channel = client.channels.get(config.channelID);

  var twitchURL = "https://api.twitch.tv/kraken/streams/" + config.userID + "?client_id=" + config.clientID;
  var twitchJSON = getJSON(twitchURL);
  var isLive = false;
  var messageSent = false;

  function getJSON(url) {
    return JSON.parse(request('GET', url, {retry: true}).getBody());
  }

  function updateJSON() {
    twitchJSON = getJSON(twitchURL);
  }

  function checkIfLive() {
    updateJSON();
    if (twitchJSON.stream != null) {
      isLive = true;
    }
    else {
      isLive = false;
    }
  }

  function createRichEmbed() {
    let gameUrl = null;
    if (twitchJSON.stream.channel.game === "") {
      twitchJSON.stream.channel.game = "No game set";
      gameUrl = "https://www.twitch.tv/directory/";
    }
    else if (twitchJSON.stream.channel.game !== "") {
      gameUrl = "https://www.twitch.tv/directory/game/" + encodeURIComponent(twitchJSON.stream.channel.game);
    }
    else if (twitchJSON.stream.channel.status === "") {
      twitchJSON.stream.channel.status = "No status set";
    }
    var embed = new Discord.RichEmbed()
      .setAuthor(twitchJSON.stream.channel.display_name, twitchJSON.stream.channel.logo)
      .setColor(0x6441A4)
      .setImage(`https://static-cdn.jtvnw.net/previews-ttv/live_user_${twitchJSON.stream.channel.name}-1152x648.jpg`)
      .setThumbnail(twitchJSON.stream.channel.logo)
      .addField("Stream", `[${twitchJSON.stream.channel.status}](${twitchJSON.stream.channel.url})`)
      .addField("Game", `[${twitchJSON.stream.channel.game}](${gameUrl})`)
      .setTimestamp()
      .setFooter(twitchJSON.stream.viewers + " Viewers");
      //.addField("Link", twitchJSON.stream.channel.url);
    return embed;
  }

  function updateRichEmbed() {
    var message = client.user.lastMessage;
    var embed = createRichEmbed();
    message.edit("@everyone", embed)
  }

  function sendLiveMessage() {
    if (twitchJSON.stream != null) {
      var embed = createRichEmbed();
      channel.send("@everyone", embed);
    }
    else {
      console.log("Could not send message");
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
    else if (isLive == true && messageSent == true) {
      updateRichEmbed();
      console.log("Updated message");
    }
    else if (isLive == false) {
      messageSent = false;
    }
  }

  setInterval(app, 30000);
});

client.login(config.botToken);
