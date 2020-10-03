const hookcord = require(`hookcord`);
const Hook = new hookcord.Hook();
const { api, webhook } = require("../config/config.json");
const { rem } = webhook;
const axios = require("axios").default;
const { kitsu, adshrink } = api;
const { URL: adshrinkUrl, token } = adshrink;
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

  server = link.split("//")[1].slice(0, -1).toUpperCase();
  Hook.setLink(rem)
    .setPayload({
      embeds: [
        {
          title: title,
          type: "link",
          image: {
            url: posterImage.tiny,
          },
          author: {
            name: message.author.username,
            icon_url: message.author.avatarURL({ format: "png" }),
          },
          fields: [
            {
              name: "Sypnosis",
              value: `${synopsis}`,
              inline: false,
            },
            {
              name: "NSFW?",
              value: nsfw ? "Si" : "No",
              inline: true,
            },
            {
              name: "Episodios",
              value:
                episodeLength != null && episodeLength > 0
                  ? episodeLength
                  : totalLength != null && totalLength > 0
                  ? totalLength
                  : "Desconocido",
              inline: true,
            },
            {
              name: "Estado",
              value: status != "tba" ? "Finalizado" : "En Emision",
              inline: true,
            },
            {
              name: server,
              value: `${await shortLink(link, slug, message)}`,
              inline: true,
            },
          ],
          timestamp: new Date(),
        },
      ],
    })
    .fire()
    .then(function (res) {
      if (res.statusCode === 204) {
        message.reply(`Tarea Realizada Correctamente, code: ${204}`);
      }
    })
    .catch(function (e) {
      message.reply(`Ha ocurrido un error:\n${e} 2`);
    });
};

const shortLink = async (link, nombre, message) => {
  try {
    const resp = await axios.get(`${URL}/${token}/json/${link}`);

    if (!resp.success)
      message.reply(`No se ha podido procesar su solicitud\n${resp.error}`);

    return resp.url;
  } catch (error) {
    message.reply(`Ha ocurrido un error al acortar el link\n${error}`);
  }
};

module.exports = {
  searchAnime,
  sendHook,
  shortLink,
};
