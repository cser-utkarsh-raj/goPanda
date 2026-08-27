// Unified desktop bridge supporting both ultra-lightweight Tauri (~5MB) and Electron

export const isTauri = (): boolean => {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
};

export const isElectron = (): boolean => {
  return typeof window !== 'undefined' && Boolean(window.electronAPI?.isElectron);
};

export const isDesktopApp = (): boolean => {
  return isTauri() || isElectron();
};

export const desktopSwitchViewMode = async (mode: 'full' | 'widget') => {
  if (isTauri()) {
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      await invoke('switch_view_mode', { mode });
      return;
    } catch {
      // Fallback
    }
  }

  if (isElectron() && window.electronAPI) {
    window.electronAPI.switchViewMode(mode);
  }
};

export const desktopToggleFullScreen = async () => {
  if (isTauri()) {
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      await invoke('toggle_fullscreen');
      return;
    } catch {
      // Fallback
    }
  }

  if (isElectron() && window.electronAPI) {
    window.electronAPI.toggleFullScreen();
  }
};

export const desktopMinimize = async () => {
  if (isTauri()) {
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      await invoke('minimize_app');
      return;
    } catch {
      // Fallback
    }
  }

  if (isElectron() && window.electronAPI) {
    window.electronAPI.minimizeApp();
  }
};

export const desktopClose = async () => {
  if (isTauri()) {
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      await invoke('close_app');
      return;
    } catch {
      // Fallback
    }
  }

  if (isElectron() && window.electronAPI) {
    window.electronAPI.closeApp();
  }
};

export const onDesktopModeChanged = async (callback: (mode: 'full' | 'widget') => void) => {
  if (isTauri()) {
    try {
      const { listen } = await import('@tauri-apps/api/event');
      const unlisten = await listen<string>('mode-changed', (event) => {
        if (event.payload === 'widget' || event.payload === 'full') {
          callback(event.payload);
        }
      });
      return unlisten;
    } catch {
      // Fallback
    }
  }

  if (isElectron() && window.electronAPI) {
    window.electronAPI.onModeChanged((mode) => {
      if (mode === 'widget' || mode === 'full') {
        callback(mode);
      }
    });
  }

  return () => {};
};
