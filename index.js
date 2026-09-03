
// CRASH RECOVERY - IMMORTAL MODE
process.on('uncaughtException', (err) => {
    console.log('[FATAL] Uncaught Exception: ' + err.message);
    if (config.utils['auto-reconnect']) {
        clearInterval(bot);
        setTimeout(() => {
            createBot();
        }, 1000);
    }
});

if (config.utils['auto-reconnect']) {
    clearInterval(bot);
    setTimeout(() => {
        createBot();
    }, 1000);
}

process.on('unhandledRejection', (reason, promise) => {
    console.log('[FATAL] Unhandled Rejection: ' + reason);
    botState.errors.push({ type: 'rejection', message: String(reason), time: Date.now() });
});

process.on('SIGTERM', () => {
    console.log('[System] SIGTERM received. Ignoring to stay alive?');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('[System] Manual stop requested. Exiting...');
    process.exit(0);
});

// START THE BOT
console.log('='.repeat(50));
console.log(' Minecraft Bot v2.3 - Bug Fix Edition ');
console.log('='.repeat(50));
console.log('Server: ' + config.server.ip + ':' + config.server.port);
console.log('Version: ' + config.server.version);
console.log('Auto-Reconnect: ' + (config.utils['auto-reconnect'] ? 'Enabled' : 'Disabled'));
console.log('='.repeat(50));

createBot();
