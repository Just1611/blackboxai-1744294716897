const { app, BrowserWindow, ipcMain, protocol } = require('electron');
const path = require('path');
const express = require('express');
const server = require('../server.js');
const isDev = process.env.NODE_ENV === 'development';

// Keep a global reference of the window object
let mainWindow;

// Security options for the main window
const mainWindowOptions = {
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../build/icon.png'),
    title: 'Clonador de Servidor Discord',
    backgroundColor: '#36393f',
    show: false, // Don't show until ready-to-show
    frame: false // Custom frame
};

function createWindow() {
    // Create the browser window
    mainWindow = new BrowserWindow(mainWindowOptions);

    // Load the app
    mainWindow.loadURL('http://localhost:8000');

    // Show window when ready
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // Open DevTools in development
    if (isDev) {
        mainWindow.webContents.openDevTools();
    }

    // Handle window state
    mainWindow.on('maximize', () => {
        mainWindow.webContents.send('window-state-changed', 'maximized');
    });

    mainWindow.on('unmaximize', () => {
        mainWindow.webContents.send('window-state-changed', 'normal');
    });

    // Handle window close
    mainWindow.on('close', (event) => {
        if (!app.isQuitting) {
            event.preventDefault();
            mainWindow.hide();
        }
        return false;
    });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
    // Security: Register custom protocol
    protocol.registerFileProtocol('safe-file', (request, callback) => {
        const url = request.url.replace('safe-file://', '');
        try {
            return callback(path.normalize(`${__dirname}/${url}`));
        } catch (error) {
            console.error(error);
        }
    });

    createWindow();

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quit when all windows are closed
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Handle any errors that occur
process.on('uncaughtException', (error) => {
    console.error('Erro não tratado:', error);
});

// IPC handlers
ipcMain.on('app-maximize', () => {
    if (!mainWindow) return;
    if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
    } else {
        mainWindow.maximize();
    }
});

ipcMain.on('app-minimize', () => {
    if (!mainWindow) return;
    mainWindow.minimize();
});

ipcMain.on('app-close', () => {
    app.isQuitting = true;
    app.quit();
});

// Security: Content Security Policy
app.on('web-contents-created', (event, contents) => {
    contents.session.webRequest.onHeadersReceived((details, callback) => {
        callback({
            responseHeaders: {
                ...details.responseHeaders,
                'Content-Security-Policy': [
                    "default-src 'self' http://localhost:8000 https://discord.com https://cdn.discordapp.com;",
                    "script-src 'self' 'unsafe-inline' http://localhost:8000 https://cdn.tailwindcss.com;",
                    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com;",
                    "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com;",
                    "img-src 'self' data: https://cdn.discordapp.com;",
                    "connect-src 'self' http://localhost:8000 https://discord.com https://cdn.discordapp.com;"
                ].join(' ')
            }
        });
    });

    // Prevent navigation to unknown protocols
    contents.on('will-navigate', (event, navigationUrl) => {
        const parsedUrl = new URL(navigationUrl);
        if (parsedUrl.origin !== 'http://localhost:8000') {
            event.preventDefault();
        }
    });

    // Prevent new window creation
    contents.setWindowOpenHandler(({ url }) => {
        return { action: 'deny' };
    });
});

// Security: Disable remote module
app.on('remote-require', (event, webContents, moduleName) => {
    event.preventDefault();
});

app.on('remote-get-builtin', (event, webContents, moduleName) => {
    event.preventDefault();
});

app.on('remote-get-global', (event, webContents, globalName) => {
    event.preventDefault();
});

app.on('remote-get-current-window', (event, webContents) => {
    event.preventDefault();
});

app.on('remote-get-current-web-contents', (event, webContents) => {
    event.preventDefault();
});
