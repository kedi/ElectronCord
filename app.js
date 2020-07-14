const url = require("url");
const path = require("path");
const electron = require("electron");
const config = require("./config.json")

const Discord = require("discord.js")
const client = new Discord.Client();

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;

app.on("ready", () => {

    mainWindow = new BrowserWindow({
        resizable: true,
        title: "Application",
        webPreferences: {
            nodeIntegration: true
        }
    });

    /**
     * We want to make sure that everything is up when we load a new url to our browser window.
     */
    client.on("ready", () => {
        mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, "public", "views", "main.html"),
            protocol: "file",
            slashes: true
        }));
    })
    
    mainWindow.on("closed", () => { app.quit() });

});

/**
 * The ipcMain event handler of the ipcRenderer. Returns with an overview information about client.
 */
ipcMain.on("get:DiscordClient", (event, arg) => {
    event.sender.send("return:DiscordClient", {
        guilds: client.guilds,
        user: client.user,
        users: client.users
    })
});


client.login(config.DISCORD_TOKEN)
