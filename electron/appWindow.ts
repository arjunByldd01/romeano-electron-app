import { type App, BrowserWindow, Tray, nativeImage, Menu } from "electron";
import windowStateKeeper from "electron-window-state";
import path from "node:path";
import { fileURLToPath } from "node:url";
import positioner from "electron-traywindow-positioner";
import MenuItems from "./menu/appMenu";
import { getcontextMenu } from "./menu/contextMenu";
import { registerMenuIpc } from "./ipc/menuIPC";
import { registerWindowStateChangedEvents } from "./windowState";
import { createRequire } from "node:module";
import { copyAudioDriver } from "./utils/copyAudioDriver";
const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import Store from "electron-store";
import { ELECTRON_STORE_KEY } from "../src/lib/enums/user";

let appWindow: BrowserWindow | null;
let tray: Tray;
let addonInstance;

process.env.APP_ROOT = path.join(__dirname, "..");

export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

const minWidth = 420;
const minHeight = 456;
// const maxWidth = 420;
const maxHeight = 510;

export function createWindow({ app }: { app: App }): BrowserWindow {
  const store = new Store();
  const savedWindowState = windowStateKeeper({
    defaultWidth: minWidth,
    defaultHeight: minHeight,
    maximize: false,
  });

  appWindow = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "romeano.svg"),
    frame: false,
    x: savedWindowState.x,
    y: savedWindowState.y,
    width: savedWindowState.width,
    height: savedWindowState.height,
    minWidth: minWidth,
    // maxWidth: maxWidth,
    show: false,
    maxHeight: maxHeight,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  // Test active push message to Renderer-process.
  appWindow.webContents.on("did-finish-load", () => {
    appWindow?.webContents.send(
      "main-process-message",
      new Date().toLocaleString()
    );
  });

  if (VITE_DEV_SERVER_URL) {
    appWindow.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // appWindow.loadFile("dist/index.html");
    appWindow.loadFile(path.join(RENDERER_DIST, "index.html"));
  }

  const menu = Menu.buildFromTemplate(MenuItems);
  Menu.setApplicationMenu(menu);

  initializeTray(app);

  appWindow.webContents.once("dom-ready", () => {
    const RomeanoAddon = require("@romeano/romeano-audio-library/romeano-package");
    addonInstance = new RomeanoAddon();

    registerMainIPC();
  });

  copyAudioDriver({
    app,
    userApiKey: store.get(ELECTRON_STORE_KEY.USER_API_KEY) as string,
    onAppQuite,
    appWindow,
  });
  savedWindowState.manage(appWindow);

  appWindow.on("close", () => {
    onAppQuite(app);
  });
  return appWindow;
}

/**
 * Register Inter Process Communication
 */
function registerMainIPC() {
  /**
   * Here you can assign IPC related codes for the application window
   * to Communicate asynchronously from the main process to renderer processes.
   */

  registerWindowStateChangedEvents(appWindow);
  registerMenuIpc(appWindow, addonInstance);
}

function initializeTray(app: App) {
  const icon = nativeImage.createFromDataURL(
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAQCAYAAADAvYV+AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADMSURBVHgBfZGhCgJBEIZHzqIoCAbFdNWkCHajINgsJqtN8AHEJ9AnsFgNYrFqM2kyGa5aRJNV/+FmuWOY2x8+Bva+HWZuifwJwUGqN20QgZ/URpY4AW8RHSdLXCjJMUtLFbAxpBfokVrkZogRqeValCyiZ6zpGc+GuAYBGQlV5yUYgbIW+fZHuvfBHJQo/sfc5KJlzhPs5EJdzqqgAO5OzkvtgjEokic5MABD49seHNMH3LmppC/Ygqu+HchMHRmBX2sFHuQJLzOVmpk/h1s5aWazsP8AAAAASUVORK5CYII="
  );

  tray = new Tray(icon);

  tray.on("click", () => {
    toggleTrayWindow();
  });
  const contextMenu = getcontextMenu({ app, appWindow });

  tray.on("right-click", () => {
    tray.popUpContextMenu(contextMenu);
  });
  tray.setToolTip("Romeano");
}

function onAppQuite(app: App) {
  addonInstance?.stopAudioControl();
  appWindow = null;
  app.quit();
  tray.destroy();
}

// Toggle Window From Tray Icon
function toggleTrayWindow() {
  if (appWindow) {
    positioner.position(appWindow, tray.getBounds());

    if (appWindow.isVisible()) {
      appWindow?.hide();
    } else {
      appWindow.show();
    }
  }
}
