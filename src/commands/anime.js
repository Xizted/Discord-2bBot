const { searchAnime } = require("../services/anime");
const { sendEmbers } = require("../controllers/Rem/remFunctions");

let link, nombreAnime, nombreAnimeArr, animes, animeID, server;

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

      if (!link.startsWith("https://") && !args[0].startsWith("https://"))
        return message.reply(`Link no valido!!!, debe incluir: https://`);

      nombreAnimeArr = [];
      for (let i = 1; i < args.length; i++) {
        nombreAnimeArr.push(args[i]);
      }
      nombreAnime = nombreAnimeArr.join(" ");

      animes = await searchAnime(nombreAnime);

      sendEmbers(message, animes, link);
    } catch (error) {
      message.reply(`Ha ocurrido un error!!!\n%${error}`);
    }
  },
};
