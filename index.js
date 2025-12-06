
const {
  Client,
  GatewayIntentBits,
  Routes,
  REST,
  PermissionsBitField
} = require("discord.js");

require("dotenv").config();

const TOKEN = process.env.BOT_TOKEN;
const LOG_CHANNEL_ID = "1427968895968481280"; // your channel ID

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ]
});

// Register slash command
const rest = new REST({ version: "10" }).setToken(TOKEN);

async function registerCommands() {
  const commands = [
    {
      name: "setupbanbot",
      description: "Creates a webhook for Minecraft ban logs in the configured channel."
    }
  ];

  try {
    await rest.put(
      Routes.applicationCommands(process.env.APP_ID),
      { body: commands }
    );
    console.log("✔ Slash command /setupbanbot registered.");
  } catch (err) {
    console.error("Error registering commands:", err);
  }
}

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// Slash command logic
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== "setupbanbot") return;

  // Admin check
  if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
    return interaction.reply({ content: "❌ You need **Administrator** to use this.", ephemeral: true });
  }

  try {
    const channel = await interaction.guild.channels.fetch(LOG_CHANNEL_ID);

    if (!channel) {
      return interaction.reply({ content: "❌ Log channel not found!", ephemeral: true });
    }

    // Create webhook
    const webhook = await channel.createWebhook({
      name: "Minecraft Ban Logger",
      avatar: client.user.displayAvatarURL()
    });

    console.log("------ WEBHOOK CREATED ------");
    console.log("Webhook URL:", webhook.url);
    console.log("-----------------------------");

    return interaction.reply({
      content:
        "✅ **Ban Bot Setup Complete!**\n\n" +
        `**Webhook created in:** <#${LOG_CHANNEL_ID}>\n\n` +
        "**Paste this Webhook URL inside your Minecraft plugin:**\n" +
        "```" + webhook.url + "```",
      ephemeral: true
    });

  } catch (err) {
    console.error(err);
    interaction.reply({ content: "❌ Something went wrong.", ephemeral: true });
  }
});

registerCommands();
client.login(TOKEN);
