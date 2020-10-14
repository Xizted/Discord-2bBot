const Discord = require("discord.js");

const editEmbers = (position, embedMessage) => {
  const newViewAnime = new Discord.MessageEmbed()
    .setTitle("¿Qué anime deseas subir?")
    .setImage(animeArr[position].attributes.posterImage.tiny);

  embedMessage.edit(newViewAnime);
  return position;
};

module.exports = {
  editEmbers,
};
