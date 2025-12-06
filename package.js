{
  "name": "minecraft-ban-logger-bot",
  "version": "1.0.0",
  "description": "Discord bot that receives ban logs from a Minecraft server plugin and sends them to a channel.",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "discord.js": "^14.15.0",
    "express": "^4.19.2",
    "body-parser": "^1.20.3"
  },
  "devDependencies": {
    "nodemon": "^3.1.0"
  }
}
