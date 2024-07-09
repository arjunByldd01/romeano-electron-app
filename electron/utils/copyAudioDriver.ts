import sudo from "sudo-prompt";
import fs from "fs";
import path from "node:path";
import { BrowserWindow, type App } from "electron";
import { IPC_EVENTS } from "../../src/lib/enums/ipc";

async function copyAudioDriver({
  app,
  userApiKey,
  onAppQuite,
  appWindow,
}: {
  app: App;
  userApiKey: string | undefined;
  onAppQuite: (app: App) => void;
  appWindow: BrowserWindow;
}) {
  const sourceDir = getDriverSourceDir(app);
  const destDir = "/Library/Audio/Plug-Ins/HAL/RomeanoAudioDriver.driver";

  try {
    await fs.promises
      .access(destDir, fs.constants.F_OK)
      .then(() => {
        // we do not copy if already driver is already available in HAL folder
      })
      .catch(async () => {
        // If the directory does not exist, proceed with the copy operation
        const command = `
          mkdir -p "/Library/Audio/Plug-Ins/HAL" &&
          cp -R "${sourceDir}" "${destDir}" && pkill coreaudiod 
        `;

        sudo.exec(command, { name: "Romeano" }, (error, stdout, stderr) => {
          if (error) {
            //error can be ocurred if user does not enter password
            onAppQuite(app);
            return;
          }

          /**
           * Description: IF user API key was available which means app will start from home page,
           * and if there is an active meeting available at that moment we have to refetch meetings.
           * And then, audioDriver will also available and it start recording automatically for that active meeting
           */
          if (userApiKey) {
            appWindow.webContents.send(IPC_EVENTS.AUDIO_DROVER_COPY);
          }
        });
      });
  } catch (err) {
    console.error("Unexpected error:", err);
  }
}

function getDriverSourceDir(app: App) {
  if (app.isPackaged) {
    const sourceDir = path.join(process.resourcesPath, "AudioDriver");
    return sourceDir;
  }

  return path.join(
    app.getAppPath(),
    "node_modules/@romeano/romeano-audio-library/romeano-package/out/Release/RomeanoAudioDriver.driver"
  );
}

export { copyAudioDriver };
