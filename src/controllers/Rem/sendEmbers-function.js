const { sendHookRem } = require("../../services/anime");

const Discord = require("discord.js");

const sendEmbers = async (message, animeArr, link) => {
  if (animeArr === undefined) return message.reply("Ha Ocurrido un error");
  let pagina = 1;
  let animes = animeArr;
  const paginas = []; //LISTA DE PÃGINAS
  for (let i = 0; i < animes.length; i++) {
    let pagina = new Discord.MessageEmbed()
      .setTitle("¿Qué anime deseas subir?")
      .setDescription(animes[i].title)
      .setImage(animes[i].image_url)
      .setFooter(`Pagina ${i + 1} de ${animes.length}`);
    //
    paginas.push(pagina);
  }

  let msg = await message.channel.send(paginas[0]);
  await msg.react("⬅️");
  await msg.react("✅");
  await msg.react("❌");
  await msg.react("➡");

  const atrasF = (reaction, user) =>
    reaction.emoji.name === "⬅️" && user.id === message.author.id;
  const proximoF = (reaction, user) =>
    reaction.emoji.name === "➡" && user.id === message.author.id;
  const obtenerF = (reaction, user) =>
    reaction.emoji.name === "✅" && user.id === message.author.id;
  const eliminarF = (reaction, user) =>
    reaction.emoji.name === "❌" && user.id === message.author.id;

  const atras = msg.createReactionCollector(atrasF, { time: 120000 });
  const proximo = msg.createReactionCollector(proximoF, { time: 120000 });
  const obtener = msg.createReactionCollector(obtenerF, { time: 120000 });
  const eliminar = msg.createReactionCollector(eliminarF, { time: 120000 });

  atras.on("collect", async function (r) {
    if (pagina < 0) return;
    pagina--;
    await msg.edit(paginas[pagina - 1]);
  }); //Vuelve a la pÃ¡gina de atrÃ¡s.

  proximo.on("collect", async function (r) {
    if (pagina === paginas.length) return;
    pagina++;
    await msg.edit(paginas[pagina - 1]);
  }); //Sube una pÃ¡gina.

  obtener.on("collect", async function (r) {
    await msg.delete().catch();
    sendHookRem(animes[pagina - 1], link, message);
  }); //Baja hasta la Ãºltima pÃ¡gina.

  eliminar.on("collect", async function (r) {
    await msg.delete().catch();
  }); //Borra el embed
};

module.exports = {
  sendEmbers,
};
