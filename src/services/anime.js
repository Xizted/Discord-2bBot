const translate = require("node-google-translate-skidz");
const { api, webhook } = require("../config/config.json");
const { Webhook, MessageBuilder } = require("discord-webhook-node");
const { rem } = webhook;
const hook = new Webhook(rem);
const axios = require("axios").default;
const { jikan, ouo } = api;
const { URL: shortURL, token } = ouo;
const { URL: jikanUrl } = jikan;

const searchAnime = async (name) => {
  try {
    const resp = await axios.get(`${jikanUrl}/search/anime`, {
      params: {
        q: name,
        page: 1,
      },
    });

    if (resp.status != 200)
      throw new Error(`No se pudo procesar su solicitud: Error ${resp.status}`);

    const { data: response } = resp;
    const { results: anime } = response;
    return anime;
  } catch (error) {
    throw new Error(`Ha ocurrido un error:\n${error} 3`);
  }
};

const sendHook = async (anime, link, message) => {
  let { image_url, title, airing, synopsis, episodes, score, url } = anime;
  let description;
  let shortL = await shortLink(link, message);

  if (shortL === undefined) return;

  translate(
    {
      text: `${synopsis}`,
      source: "en",
      target: "es",
    },
    async (result) => {
      description = result.translation;
      server = link.split("//")[1].split("/")[0].toUpperCase();

      const msg = new MessageBuilder()
        .setAuthor(
          message.author.username,
          message.author.avatarURL({ format: "png" })
        )
        .setTitle(title)
        .setDescription(`${description}`)
        .setImage(image_url)
        .addField("Score", `${score}`,true)
        .addField("Episodios", `${episodes}`,true)
        .addField("Estado", !airing ? "Finalizado" : "En Emision", true)
        .addField(server, `${shortL}`,)
        .setTimestamp();

      hook
        .send(msg)
        .then((res) => {
          message.reply(`Tarea Realizada con Exito!!!`);
        })
        .catch((e) => {
          console.log(e);
          message.reply(`Ha ocurrido un error:\n${e} 2`);
        });
    }
  );
};

const shortLink = async (link, message) => {
  try {
    const resp = await axios.get(`${shortURL}/${token}`, {
      params: {
        s: link,
      },
    });
    return resp.data;
  } catch (error) {
    message.reply(`Ha ocurrido un error al acortar el link\n${error}`);
  }
};

module.exports = {
  searchAnime,
  sendHook,
  shortLink,
};
