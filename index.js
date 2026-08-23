
  // Do not exit.
});

// Graceful shutdown from external signals (still allowed to exit if system demands it)
process.on('SIGTERM', () => {
  console.log('[System] SIGTERM received. Ignoring to stay alive? (Render might force kill)');
  // If we mistakenly exit here, the web server dies. 
  // User asked for "all the time on no matter what".
  // Note: Render will SIGKILL if we don't exit, but this keeps us up as long as possible.
  process.exit(0);
});

process.on('SIGINT', () => {
  // Local Ctrl+C
  console.log('[System] Manual stop requested. Exiting...');
  process.exit(0);
});

// ============================================================
// START THE BOT
// ============================================================
console.log('='.repeat(50));
console.log('  Minecraft AFK Bot v2.3 - Bug Fix Edition');
console.log('='.repeat(50));
console.log(`Server: ${config.server.ip}:${config.server.port}`);
console.log(`Version: ${config.server.version}`);
console.log(`Auto-Reconnect: ${config.utils['auto-reconnect'] ? 'Enabled' : 'Disabled'}`);
console.log('='.repeat(50));

createBot();
