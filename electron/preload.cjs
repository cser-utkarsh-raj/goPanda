const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  switchViewMode: (mode) => ipcRenderer.send('switch-view-mode', mode),
  toggleViewMode: () => ipcRenderer.send('toggle-view-mode'),
  toggleFullScreen: () => ipcRenderer.send('toggle-fullscreen'),
  minimizeApp: () => ipcRenderer.send('minimize-app'),
  closeApp: () => ipcRenderer.send('close-app'),
  onModeChanged: (callback) => {
    ipcRenderer.on('mode-changed', (event, mode) => callback(mode));
  },
});
