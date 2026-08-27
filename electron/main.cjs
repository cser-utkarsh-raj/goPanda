const { app, BrowserWindow, ipcMain, screen, Menu } = require('electron');
const path = require('path');

let mainWindow = null;
let currentMode = 'full'; // Start as the full desktop app studio!
let savedBounds = null;

function getIconPath() {
  return path.join(__dirname, '../public/icon.png');
}

function createAppWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;

  const defaultWidth = Math.min(1240, Math.max(960, screenWidth - 120));
  const defaultHeight = Math.min(840, Math.max(680, screenHeight - 100));

  mainWindow = new BrowserWindow({
    width: defaultWidth,
    height: defaultHeight,
    minWidth: 840,
    minHeight: 580,
    center: true,
    title: 'goPanda - Focus Timer & Productivity Studio',
    icon: getIconPath(),
    backgroundColor: '#FAF9F6',
    autoHideMenuBar: true,
    show: false, // Show gracefully once ready
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      devTools: !app.isPackaged,
    },
  });

  // Load app (dist build or dev server)
  if (app.isPackaged || process.env.NODE_ENV === 'production') {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  } else {
    mainWindow.loadURL('http://localhost:3000');
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function switchToFullMode() {
  if (!mainWindow) return;
  currentMode = 'full';

  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;

  const targetWidth = savedBounds?.width || Math.min(1240, screenWidth - 120);
  const targetHeight = savedBounds?.height || Math.min(840, screenHeight - 100);

  mainWindow.setAlwaysOnTop(false);
  mainWindow.setResizable(true);
  mainWindow.setSize(targetWidth, targetHeight);

  if (savedBounds) {
    mainWindow.setPosition(savedBounds.x, savedBounds.y);
  } else {
    mainWindow.center();
  }

  mainWindow.webContents.send('mode-changed', 'full');
}

function switchToWidgetMode() {
  if (!mainWindow) return;
  savedBounds = mainWindow.getBounds();
  currentMode = 'widget';

  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;

  const widgetWidth = 170;
  const widgetHeight = 190;

  mainWindow.setResizable(false);
  mainWindow.setSize(widgetWidth, widgetHeight);
  mainWindow.setPosition(screenWidth - widgetWidth - 24, screenHeight - widgetHeight - 28);
  mainWindow.setAlwaysOnTop(true, 'screen-saver');
  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

  mainWindow.webContents.send('mode-changed', 'widget');
}

// IPC Handlers
ipcMain.on('switch-view-mode', (event, mode) => {
  if (mode === 'widget') {
    switchToWidgetMode();
  } else {
    switchToFullMode();
  }
});

ipcMain.on('toggle-view-mode', () => {
  if (currentMode === 'widget') {
    switchToFullMode();
  } else {
    switchToWidgetMode();
  }
});

ipcMain.on('toggle-fullscreen', () => {
  if (!mainWindow) return;
  const isFull = mainWindow.isFullScreen();
  mainWindow.setFullScreen(!isFull);
});

ipcMain.on('minimize-app', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('close-app', () => {
  if (mainWindow) mainWindow.close();
});

app.whenReady().then(() => {
  createAppWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createAppWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

