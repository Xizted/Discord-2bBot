module.exports = {
  name: "delete",
  description: "Eliminar mensajes",
  execute(message, args) {
    if (!args.length)
      return message.reply("Debes especificar cuantos mensajes deseas borrar");
    if (args.length > 1) return message.reply("Debes mandar un solo argumento");

    let count = parseInt(args[0]) + 1;
    
    if (isNaN(count)) {
      return message.reply("El argumento enviado no es un número valido");
    } else if (count >= 1 || count < 51) {
      return message.channel.bulkDelete(count);
    } else {
      return message.reply("El número debe ser mayor a 1 y menor a 50");
    }
  },
};
