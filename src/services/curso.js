const shortLink = require("./shortLink");
const { webhook } = require("../config/config.json");
const { Webhook, MessageBuilder } = require("discord-webhook-node");
const { prunia } = webhook;
const hook = new Webhook(prunia);

const sendHookPrunia = async (cursoNombre, link, img, message) => {
  let shortL = await shortLink(link, message);
  let server = link.split("//")[1].split("/")[0].toUpperCase();

  if (shortL === undefined) return;

  const msg = new MessageBuilder()
    .setAuthor(
      message.author.username,
      message.author.avatarURL({ format: "png" })
    )
    .setTitle(cursoNombre)
    .setImage(img)
    .addField(server, `${shortL}`)
    .setTimestamp();

  hook
    .send(msg)
    .then((res) => {
      message.channel.bulkDelete(1);
      message.reply(`Tarea Realizada con Exito!!!`);
    })
    .catch((e) => {
      console.log(e);
      message.channel.bulkDelete(1);
      message.reply(`Ha ocurrido un error:\n${e} 2`);
    });
};

module.exports = {
  sendHookPrunia,
};
