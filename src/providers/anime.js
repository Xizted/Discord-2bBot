const translate = require("node-google-translate-skidz");
const { api, webhook } = require("../config/config.json");
const { Webhook, MessageBuilder } = require("discord-webhook-node");
const { rem } = webhook;
const hook = new Webhook(rem);
const axios = require("axios").default;
const { kitsu, shortst } = api;
const { URL: urlShortSt, token } = shortst;
const { URL: kitsuUrl } = kitsu;

const searchAnime = async (name) => {
  try {
    const resp = await axios.get(`${kitsuUrl}`, {
      headers: {
        "Content-Type": "application/vnd.api+json",
      },
      params: {
        "filter[text]": name,
      },
    });

    if (resp.status != 200)
      throw new Error(`No se pudo procesar su solicitud: Error ${resp.status}`);

    const { data: response } = resp;
    const { data: anime } = response;
    return anime;
  } catch (error) {
    throw new Error(`Ha ocurrido un error:\n${error} 3`);
  }
};

const sendHook = async (data, link, message) => {
  let {
    synopsis,
    canonicalTitle: title,
    status,
    slug,
    posterImage,
    episodeLength,
    totalLength,
    nsfw,
  } = data;

  let description;
  let shortL = await shortLink(link, slug, message);

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
        .setImage(posterImage.medium)
        .addField("NSFW?", nsfw ? "Si" : "No", true)
        .addField(
          "Episodios",
          episodeLength != null && episodeLength > 0
            ? episodeLength
            : totalLength != null && totalLength > 0
            ? totalLength
            : "Desconocido",
          true
        )
        .addField("Estado", status != "tba" ? "Finalizado" : "En Emision", true)
        .addField(server, `${shortL}`, true)
        .setTimestamp();

      hook
        .send(msg)
        .then((res) => {
          message.reply(`Tarea Realizada con Exito!!!`);
        })
        .catch((e) => {
          message.reply(`Ha ocurrido un error:\n${e} 2`);
        });
    }
  );
};

const shortLink = async (link, nombre, message) => {
  try {
    const resp = axios({
      method: "PUT",
      url: urlShortSt,
      headers: {
        "public-api-token": token,
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: "PHPSESSID=51hgonnqkchnb2duqnfhsqm0f6; cookies-enable=1; hl=en",
      },
      data: {
        urlToShorten: link,
      },
    });

    const { data } = await resp;
    if (data.status != "ok")
      throw new Error(`No se pudo realizar su peticion de acortar link`);
    return data.shortenedUrl;
  } catch (error) {
    message.reply(`Ha ocurrido un error al acortar el link\n${error}`);
  }
};

module.exports = {
  searchAnime,
  sendHook,
  shortLink,
};
