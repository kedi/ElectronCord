const electron = require("electron");
const { ipcRenderer } = electron;

ipcRenderer.send("get:DiscordClient", "hi")


ipcRenderer.on("return:DiscordClient", (event, client) => {
    document.querySelectorAll("p")[0].innerHTML = `Your bot is on ${client.guilds.size} guild and serving ${client.users.size} users!`
})



;0

