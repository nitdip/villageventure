// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits } = require('discord.js');

// Load your bot's token from an environment variable or a configuration file
const { token } = require('./config.json'); // Replace with your bot's token
const { gatherResources, getStockpile } = require('./resources');

// Create a new client instance with necessary intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent, // If you need to access the content of messages
    GatewayIntentBits.GuildMessageReactions
  ]
});

// When the client is ready, run this code
client.once(Events.ClientReady, () => {
    console.log(`Ready! Logged in as ${client.user.tag}`);
});

// Respond to messages
client.on(Events.MessageCreate, async message => {
    if (message.content.startsWith('!gather')) {
        // store user and guild comman information
        const [command, resourceType] = message.content.trim().split(' ');
        const userId = message.author.id;
        const guildId = message.guild.id;

        // call the function
        try {
          // call gatherResources and wait for the result
          const result = await gatherResources(userId, guildId, resourceType);
          message.reply(`You have successfully gathered ${result.amount} ${result.resourceType}.`);
        } catch (error) {
          // if an invalid resource type is provided sen an error message
          message.reply(error.message);
        }
      } 

    if (message.content == '!stockpile') {
      const guildId = message.guild.id;
      try {
        const stockpile = getStockpile(guildId);
        let stockpileMessage = `${message.guild.name}'s stockpile:\n`
        for (const resource in stockpile) {
          stockpileMessage += `${resource.charAt(0).toUpperCase() + resource.slice(1)}: ${stockpile[resource]}\n`;
        }
        message.reply(stockpileMessage);
      } catch (error) {
        message.reply('Failed to retrieve stockpile.');
        console.error(error);
      }
    }
});

// Log in to Discord with your client's token
client.login(token);
