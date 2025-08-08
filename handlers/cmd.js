const fs = require("fs");
const path = require("path");
const colors = require("colors")
module.exports = (client) => {

  fs.readdirSync("./commands").forEach((folder) => {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(
      (file) => file.endsWith(".js")
    );
    for (const file of commandFiles) {
     const command = require(`../commands/${folder}/${file}`);
      if(command?.name) {
         console.log(`${command.name} Loaded`.green)
         client.commands.set(command.name, command);
      } else {
        console.log(`${file} not Working`.red)
      }
   
    }
  });
};
