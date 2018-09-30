# Discord Twitch Livebot

This is webhook bot for discord that posts in a chat when you go live on twitch.
This project requires node.js: http://nodejs.org

### Requirements:

	discord.js: npm install discord.js
	sync-request: npm install sync-request

### Starting

There are two versions of this bot: A webhook and a normal bot. The bot updates the message during the stream to show the latest title etc.

Start bot with:		npm run bot

Start webhook with:	npm run webhook

### Experimental Features

You can use multiple streams on one bot by launching the bot and adding the username at the end.  
Example: npm run bot username or node bot/bot.js username

Please let the code run through the loop at least once before running another instance. (About 30 seconds)
