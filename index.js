const mineflayer = require('mineflayer');
const express = require('express');
const config = require('./settings.json');

// 1. Keep-Alive Web Server (For Render / UptimeRobot)
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Aternos AFK Bot is Online!');
});

app.listen(port, () => {
  console.log(`Keep-alive server listening on port ${port}`);
});

// 2. Create & Connect the Bot
let afkInterval;

function createBot() {
  const bot = mineflayer.createBot({
    host: config.server.ip,
    port: Number(config.server.port),
    username: config['bot-account'].username,
    version: config.server.version,
    auth: config['bot-account'].type
  });

  bot.once('spawn', () => {
    console.log(`[BOT] ${bot.username} joined ${config.server.ip}:${config.server.port}`);

    // Anti-AFK Movement Loop
    if (config.utils['anti-afk'].enabled) {
      afkInterval = setInterval(() => {
        if (config.utils['anti-afk'].jump) {
          bot.setControlState('jump', true);
          setTimeout(() => bot.setControlState('jump', false), 500);
        }
        if (config.utils['anti-afk'].sneak) {
          bot.setControlState('sneak', true);
          setTimeout(() => bot.setControlState('sneak', false), 500);
        }
        bot.look(Math.random() * Math.PI * 2, 0);
      }, 20000);
    }
  });

  bot.on('kicked', (reason) => {
    console.log('[BOT] Kicked from server:', reason);
  });

  bot.on('error', (err) => {
    console.log('[BOT] Connection error:', err.message);
  });

  bot.on('end', () => {
    clearInterval(afkInterval);
    console.log('[BOT] Disconnected.');

    if (config.utils['auto-reconnect']) {
      const delay = config.utils['auto-reconnect-delay'] || 10000;
      console.log(`[BOT] Reconnecting in ${delay / 1000} seconds...`);
      setTimeout(createBot, delay);
    }
  });
}

createBot();

