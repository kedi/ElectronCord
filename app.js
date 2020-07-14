const electron = require("electron");
const config = require("./config.json");
const Discord = require("discord.js");
const express = require("express");
const bodyParser = require("body-parser")
const client = new Discord.Client();
const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;

const ExpressApp = express();

ExpressApp.listen(3000);

ExpressApp.set("view engine", "ejs");
ExpressApp.use("/public", express.static("public"));
ExpressApp.use(bodyParser.urlencoded({extended: true}))

ExpressApp.get("/", async(req, res) => {

    res.render("main", {client});

});

ExpressApp.post("/guilds/", async(req,res) => {

    let guild = await client.guilds.get(req.body.guildID)
    if(!guild) return res.render("main", {client});

    return res.render("guildUI", {client, guild});
    
})


// ExpressApp.post("/guilds", async(req,res) => {

//     let guild = await client.guilds.get(req.body.guildID)
//     if(!guild) return res.render("main", {client});
    
//     return res.render("guildUI", {client, guild});

// })

app.on("ready", () => {

    mainWindow = new BrowserWindow({
        width: 1920,
        height: 1080,
        resizable: true,
        title: "Application",
        webPreferences: {
            nodeIntegration: true
        }
    });

    client.on("ready", () => {

        mainWindow.loadURL("http://localhost:3000/");
        mainWindow.on("closed", () => {

            app.quit();

        });
    
    });

    mainWindow.setMenu(null);
    mainWindow.webContents.openDevTools()
});

/**
 * The ipcMain event handler of the ipcRenderer. Returns with an overview information about client.
 */
ipcMain.on("get:DiscordClient", (event, arg) => {

    event.sender.send("return:DiscordClient", {
        guilds: client.guilds,
        user: client.user,
        users: client.users
    });

});

client.login(config.DISCORD_TOKEN);