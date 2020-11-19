const { bot } = require("./config/config.json");
const { prefix, token, roles } = bot;

const fs = require("fs");
const Discord = require("discord.js");
const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs
  .readdirSync(`${__dirname}/commands`)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  client.commands.set(command.name, command);
}

client.once("ready", () => {
  console.log("Ready!!!");
});

client.on("message", (message) => {
  // Si el mensaje no comienza con el prefijo o el autor es un bot salirse de la funcion
  if (
    !message.content.startsWith(prefix) ||
    message.author.bot ||
    !message.member.roles.cache.some((role) => roles.includes(role.name))
  )
    return;
  const args = message.content.slice(prefix.length).trim().split(/ +/); // Argunmentos
  const command = args.shift().toLowerCase(); // Comando Enviado

  if (!client.commands.has(command)) return;

  try {
    client.commands.get(command).execute(message, args);
  } catch (err) {
    message.reply("Hubo un error al tratar de ejecutar ese comando! 4" + err);
  }
});

client.login(token);
