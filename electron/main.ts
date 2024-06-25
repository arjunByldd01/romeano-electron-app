import { app, BrowserWindow } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createWindow } from "./appWindow";
import installExtension, {
  REACT_DEVELOPER_TOOLS,
} from "electron-devtools-installer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(__dirname, "dist-electron");
export const RENDERER_DIST = path.join(__dirname, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(__dirname, "public")
  : RENDERER_DIST;

let appWindow: BrowserWindow | null;

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    appWindow = null;
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    appWindow = createWindow({ app });
  }
});

// app.whenReady().then(createWindow);

app.whenReady().then(() => {
  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => {
      console.info(`Added Extension:  ${name}`);
      appWindow = createWindow({ app });
    })
    .catch((err) => console.info("An error occurred: ", err));
});
