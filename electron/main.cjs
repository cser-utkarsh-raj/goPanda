const { app, BrowserWindow, ipcMain, screen, Tray, Menu } = require('electron');
const path = require('path');

let mainWindow = null;
let tray = null;
let currentMode = 'mini'; // default to cute floating circular widget on desktop!

function createFloatingWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;

  // Floating Circular Widget dimensions
  const miniWidth = 140;
  const miniHeight = 160;

  mainWindow = new BrowserWindow({
    width: miniWidth,
    height: miniHeight,
    x: screenWidth - miniWidth - 30,
    y: screenHeight - miniHeight - 40,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    hasShadow: false,
    skipTaskbar: false,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      devTools: !app.isPackaged,
    },
  });

  // Keep floating on top of all full-screen games, YouTube, Brave, etc.
  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  mainWindow.setAlwaysOnTop(true, 'screen-saver');

  // Load app (production build index.html or dev server)
  if (app.isPackaged || process.env.NODE_ENV === 'production') {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  } else {
    mainWindow.loadURL('http://localhost:3000');
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function switchToFullMode() {
  if (!mainWindow) return;
  currentMode = 'full';

  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;
  const fullWidth = Math.min(1150, screenWidth - 100);
  const fullHeight = Math.min(800, screenHeight - 80);

  mainWindow.setAlwaysOnTop(false);
  mainWindow.setResizable(true);
  mainWindow.setSize(fullWidth, fullHeight);
  mainWindow.center();
  mainWindow.webContents.send('mode-changed', 'full');
}

function switchToMiniMode() {
  if (!mainWindow) return;
  currentMode = 'mini';

  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;
  const miniWidth = 140;
  const miniHeight = 160;

  mainWindow.setSize(miniWidth, miniHeight);
  mainWindow.setPosition(screenWidth - miniWidth - 30, screenHeight - miniHeight - 40);
  mainWindow.setAlwaysOnTop(true, 'screen-saver');
  mainWindow.setResizable(false);
  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  mainWindow.webContents.send('mode-changed', 'mini');
}

// IPC Handlers from React Web App
ipcMain.on('switch-view-mode', (event, mode) => {
  if (mode === 'full') {
    switchToFullMode();
  } else {
    switchToMiniMode();
  }
});

ipcMain.on('toggle-view-mode', () => {
  if (currentMode === 'mini') {
    switchToFullMode();
  } else {
    switchToMiniMode();
  }
});

ipcMain.on('minimize-app', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('close-app', () => {
  if (mainWindow) mainWindow.close();
});

app.whenReady().then(() => {
  createFloatingWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createFloatingWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
