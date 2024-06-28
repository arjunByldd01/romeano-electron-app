import { BrowserWindow, ipcMain, Menu, shell, app } from "electron";
import Store from "electron-store";
import { MenuChannels } from "../channels/menuChannels";
import { IPC_EVENTS } from "../../src/lib/enums/ipc";
import {
  getCafAndOggFilePath,
  onStartRecording,
  onStopRecording,
} from "../../src/utils/ipc/recording";
import { IRecordingDataFromMain } from "../../src/types/recording";
import { ISelectTagOption } from "../../src/types/meeting";
import path from "path";

const store = new Store();
export const registerMenuIpc = (mainWindow: BrowserWindow, addonInstance) => {
  ipcMain.on(MenuChannels.EXECUTE_MENU_ITEM_BY_ID, (event, id) => {
    const currentMenu = Menu.getApplicationMenu();

    if (currentMenu === null) {
      return;
    }

    const menuItem = currentMenu.getMenuItemById(id);
    if (menuItem) {
      const window = BrowserWindow.fromWebContents(event.sender) || undefined;
      menuItem.click(null, window, event.sender);
    }
  });

  ipcMain.on(MenuChannels.SHOW_CONTEXT_MENU, (event, template) => {
    const menu = Menu.buildFromTemplate(template);
    const window = BrowserWindow.fromWebContents(event.sender);
    if (window) {
      menu.popup({ window });
    }
  });

  ipcMain.handle(MenuChannels.WINDOW_MINIMIZE, () => {
    mainWindow.minimize();
  });

  ipcMain.handle(MenuChannels.WINDOW_MAXIMIZE, () => {
    mainWindow.maximize();
  });

  ipcMain.handle(MenuChannels.WINDOW_TOGGLE_MAXIMIZE, () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });

  ipcMain.handle(MenuChannels.WINDOW_CLOSE, () => {
    mainWindow.close();
  });

  ipcMain.handle(MenuChannels.WEB_TOGGLE_DEVTOOLS, () => {
    mainWindow.webContents.toggleDevTools();
  });

  ipcMain.handle(MenuChannels.WEB_ACTUAL_SIZE, () => {
    mainWindow.webContents.setZoomLevel(0);
  });

  ipcMain.handle(MenuChannels.WEB_ZOOM_IN, () => {
    mainWindow.webContents.setZoomLevel(mainWindow.webContents.zoomLevel + 0.5);
  });

  ipcMain.handle(MenuChannels.WEB_ZOOM_OUT, () => {
    mainWindow.webContents.setZoomLevel(mainWindow.webContents.zoomLevel - 0.5);
  });

  ipcMain.handle(MenuChannels.WEB_TOGGLE_FULLSCREEN, () => {
    mainWindow.setFullScreen(!mainWindow.fullScreen);
  });

  ipcMain.handle(MenuChannels.OPEN_GITHUB_PROFILE, (_event, id) => {
    shell.openExternal(`https://github.com/${id}`);
  });

  ipcMain.on(IPC_EVENTS.RESIZE_SETUP_PAGE, () => {
    mainWindow.setSize(420, 201);
  });

  ipcMain.on(IPC_EVENTS.RESIZE_HOME_PAGE, (event, height) => {
    mainWindow.setSize(420, height);
  });

  ipcMain.on(IPC_EVENTS.ELECTRON_STORE_GET, async (event, key) => {
    event.returnValue = store.get(key);
  });

  ipcMain.on(IPC_EVENTS.ELECTRON_STORE_SET, async (event, key, val) => {
    store.set(key, val);
  });

  ipcMain.on(IPC_EVENTS.ELECTRON_STORE_DELETE, async (event, key) => {
    store.delete(key);
  });

  //IPC Event for recording

  // renderer to main
  ipcMain.on(IPC_EVENTS.RECORDING_ON, async () => {
    const filePath = getCafAndOggFilePath();
    addonInstance.startRecording(path.join(filePath, "romeanoaddon.caf"));
    // onStartRecording();
  });

  ipcMain.on(IPC_EVENTS.RECORDING_PAUSE, async () => {
    addonInstance.pauseRecording();
    // onStartRecording();
  });
  ipcMain.on(IPC_EVENTS.RECORDING_RESUME, async () => {
    addonInstance.resumeRecording();
    // onStartRecording();
  });
  ipcMain.on(IPC_EVENTS.RECORDING_OFF, async (event) => {
    addonInstance.stopRecording();
    addonInstance.stopAudioControl();
    const dataToSend = await onStopRecording();
    event.reply(IPC_EVENTS.UPLOAD_RECORDING, dataToSend);
  });

  ipcMain.on(IPC_EVENTS.MIC_CHANGED, async (event, value) => {
    console.log("Mic Changed", value);
  });

  const micOptions: ISelectTagOption[] = [
    { name: "MacBook Pro Microphone", value: "macbookProMicrophone" },
    { name: "MacBook Pro Microphone", value: "macbookProMicrophone" },
  ];

  mainWindow.webContents.send(IPC_EVENTS.MIC_OPTIONS_FROM_MAIN, micOptions);
};
