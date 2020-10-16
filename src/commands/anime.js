const { searchAnimeRem } = require("../services/services.exports");
const { sendEmbers } = require("../controllers/Rem/rem.exports");
const { server } = require("../config/config.json");

let link, nombreAnime, nombreAnimeArr, animes;

module.exports = {
  name: "anime",
  description: "",
  async execute(message, args) {
    try {
      if (args.length < 2)
        return message.reply(
          `Debes mandar 2 argumentos: [link] [nombre-anime]`
        );
      link = args[0];

      if (!link.includes(server.mega) && !args[0].includes(server.mega))
        return message.reply(`Link no valido!!!, debe incluir: ${server.mega}`);

      nombreAnimeArr = [];
      for (let i = 1; i < args.length; i++) {
        nombreAnimeArr.push(args[i]);
      }
      nombreAnime = nombreAnimeArr.join(" ");

      animes = await searchAnimeRem(nombreAnime);

      sendEmbers(message, animes, link);
    } catch (error) {
      message.reply(`Ha ocurrido un error!!!\n%${error}`);
    }
  },
};
