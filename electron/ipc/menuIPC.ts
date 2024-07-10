import { BrowserWindow, ipcMain, Menu, shell } from "electron";
import Store from "electron-store";
import { MenuChannels } from "../channels/menuChannels";
import { IPC_EVENTS } from "../../src/lib/enums/ipc";

import { IMeeting, ISelectTagOption } from "../../src/types/meeting";
import path from "path";
import schedule from "node-schedule";
import {
  getCafAndOggFileDir,
  onStopRecording,
  scheduleRecordingTask,
  startRecordingOnAppOpen,
} from "../utils/recording";

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

  ipcMain.on(IPC_EVENTS.RESIZE_HOME_PAGE, (_, height) => {
    mainWindow.setSize(420, height);
  });

  ipcMain.on(IPC_EVENTS.ELECTRON_STORE_GET, async (event, key) => {
    event.returnValue = store.get(key);
  });

  ipcMain.on(IPC_EVENTS.ELECTRON_STORE_SET, async (_, key, val) => {
    store.set(key, val);
  });

  ipcMain.on(IPC_EVENTS.ELECTRON_STORE_DELETE, async (_, key) => {
    store.delete(key);
  });

  //IPC Event for recording

  // renderer to main
  ipcMain.on(IPC_EVENTS.RECORDING_ON, async (_, fileName) => {
    await addonInstance.startAudioControl(0);
    const fileDir = getCafAndOggFileDir();
    await addonInstance.startRecording(path.join(fileDir, fileName));
  });

  ipcMain.on(IPC_EVENTS.RECORDING_PAUSE, async () => {
    addonInstance.pauseRecording();
  });

  ipcMain.on(IPC_EVENTS.RECORDING_RESUME, async () => {
    addonInstance.resumeRecording();
  });

  ipcMain.on(IPC_EVENTS.RECORDING_OFF, async (event) => {
    addonInstance.stopRecording();
    // addonInstance.stopAudioControl();
    const dataToSend = await onStopRecording();
    event.reply(IPC_EVENTS.UPLOAD_RECORDING, dataToSend);
  });

  ipcMain.on(IPC_EVENTS.MIC_CHANGED, async (_, value) => {
    console.log("Mic Changed", value);
  });

  ipcMain.on(
    IPC_EVENTS.SCHEDULE_RECORDING_TASK,
    async (_, upcomingMeetings: IMeeting[]) => {
      scheduleRecordingTask({ addonInstance, mainWindow, upcomingMeetings });
    }
  );

  ipcMain.on(
    IPC_EVENTS.RECORD_ACTIVE_MEETING_ON_OPEN_APP,
    async (_, activeMeeting: IMeeting) => {
      startRecordingOnAppOpen({ activeMeeting, addonInstance, mainWindow });
    }
  );

  const micOptions: ISelectTagOption[] = [
    { name: "MacBook Pro Microphone", value: "macbookProMicrophone" },
    { name: "MacBook Pro Microphone", value: "macbookProMicrophone" },
  ];

  mainWindow.webContents.send(IPC_EVENTS.MIC_OPTIONS_FROM_MAIN, micOptions);
};
