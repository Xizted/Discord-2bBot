const axios = require("axios").default;
const { api } = require("../config/config.json");
const { ouo } = api;
const { URL: shortURL, token } = ouo;

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

module.exports = shortLink;
