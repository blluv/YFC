const { default: axios } = require('axios');
const { app, screen, BrowserWindow } = require('electron');
const express = require('express');

const eapp = express();
const server = require('http').createServer(eapp);
const io = require('socket.io')(server, {
    cors: {
        origin: "https://www.youtube.com",
        methods: ["GET", "POST"],
        credentials: true
    }
});

const path = require('path')
const url = require('url')

let win
function createWindow() {
    let display = screen.getPrimaryDisplay();
    let screen_width = display.bounds.width;

    let width = 400;
    let height = 85;

    let x_pos = "LEFT"
    win = new BrowserWindow({
        width,
        height,
        x: x_pos == "LEFT" ? 0 : screen_width - width,
        y: 0,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        hasShadow: false,
        roundedCorners: false,
        minimizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })
    win.setVisibleOnAllWorkspaces(true);
    win.setIgnoreMouseEvents(true);

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'public', 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    win.webContents.openDevTools()

    win.on('closed', () => {
        win = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})

io.on('connection', (connection) => {
    connection.on("LOAD", (payload) => {
        if (win !== null) {
            axios.get(payload.url + "&fmt=json3").then(res => {win.webContents.send('LOAD', res.data)})
        }
    });
    connection.on("UNLOAD", (payload) => {
        console.log("UNLOAD")
        if (win !== null) {
            win.webContents.send('UNLOAD', payload)
        }
    })
    connection.on("CHANGE_POS", (payload) => {
        console.log("CHANGE_POS")
        if (win !== null) {
            win.webContents.send('CHANGE_POS', payload)
        }
    })

    connection.on("RANGE_ENTER", (payload) => {
        console.log("RANGE_ENTER", payload)
        if (win !== null) {
            win.webContents.send('RANGE_ENTER', payload)
        }
    })
});

server.listen(9019, () => {
    console.log('socket io running');
});