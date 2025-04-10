const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    'api', {
        // Window control
        minimize: () => ipcRenderer.send('app-minimize'),
        maximize: () => ipcRenderer.send('app-maximize'),
        close: () => ipcRenderer.send('app-close'),
        
        // Listen for window state changes
        onWindowStateChange: (callback) => {
            ipcRenderer.on('window-state-changed', (_, state) => callback(state));
        },

        // Version info
        getVersion: () => process.env.npm_package_version || '1.0.0',

        // System info
        getPlatform: () => process.platform,

        // Discord API related functions
        isValidToken: async (token) => {
            try {
                const response = await fetch('https://discord.com/api/v9/users/@me', {
                    headers: {
                        'Authorization': token
                    }
                });
                return response.ok;
            } catch (error) {
                return false;
            }
        },

        isValidServerId: async (serverId) => {
            try {
                const response = await fetch(`https://discord.com/api/v9/guilds/${serverId}`, {
                    headers: {
                        'Authorization': localStorage.getItem('discord_token')
                    }
                });
                return response.ok;
            } catch (error) {
                return false;
            }
        },

        // App state
        store: {
            get: (key) => localStorage.getItem(key),
            set: (key, value) => localStorage.setItem(key, value),
            remove: (key) => localStorage.removeItem(key)
        }
    }
);

// Security warning in console
console.log(
    '%cAviso de Segurança!',
    'color: red; font-size: 24px; font-weight: bold;'
);
console.log(
    '%cNunca cole códigos desconhecidos aqui. Isso pode comprometer sua conta do Discord.',
    'color: red; font-size: 16px;'
);

// Disable eval
window.eval = global.eval = function () {
    throw new Error('Eval não é permitido por motivos de segurança.');
};

// Handle errors
window.addEventListener('error', (event) => {
    console.error('Erro na aplicação:', event.error);
    event.preventDefault();
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Promessa não tratada:', event.reason);
    event.preventDefault();
});

// Prevent drag and drop
document.addEventListener('dragover', (event) => event.preventDefault());
document.addEventListener('drop', (event) => event.preventDefault());

// Prevent context menu in production
if (process.env.NODE_ENV === 'production') {
    document.addEventListener('contextmenu', (event) => event.preventDefault());
}
