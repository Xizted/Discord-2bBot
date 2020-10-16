let link, img, nombreCurso, nombreCursoArr;
const { server } = require("../config/config.json");
const { sendHookPrunia } = require("../services/services.exports");

module.exports = {
  name: "curso",
  description: "Upload Course to mega",
  execute(message, args) {
    try {
      if (args.length < 3)
        return message.reply(
          `Debes mandar 3 argumentos: [link] [imagen] [nombreCurso]`
        );
      link = args[0];
      img = args[1];

      if (!link.includes(server.mega) && !args[0].includes(server.mega))
        return message.reply(`Link no valido!!!, debe incluir: ${server.mega}`);

      if (
        img.match(/(\W|^)(png|jpg|jpeg)(\W|$)/) === null &&
        args[1].match(/(\W|^)(png|jpg|jpeg)(\W|$)/) === null
      )
        return message.reply(
          `Imagen no valida!!!, debe incluir: .png o .jpg al final del link`
        );

      nombreCursoArr = [];
      for (let i = 2; i < args.length; i++) {
        nombreCursoArr.push(args[i]);
      }
      nombreCurso = nombreCursoArr.join(" ");

      sendHookPrunia(nombreCurso, link, img, message);
    } catch (error) {
      message.reply(`Ha ocurrido un error!!!\n%${error}`);
    }
  },
};
