import sudo from "sudo-prompt";
import fs from "fs";
import path from "node:path";
import { type App } from "electron";

async function copyAudioDriver(app: App) {
  const sourceDir = getDriverSourceDir(app);
  const destDir = "/Library/Audio/Plug-Ins/HAL/RomeanoAudioDriver.driver";

  try {
    await fs.promises
      .access(destDir, fs.constants.F_OK)
      .then(() => {
        console.log("RomeanoAudioDriver.driver already exists. Skipping copy.");
      })
      .catch(async () => {
        // If the directory does not exist, proceed with the copy operation
        const command = `
          mkdir -p "/Library/Audio/Plug-Ins/HAL" &&
          cp -R "${sourceDir}" "${destDir}" && pkill coreaudiod 
        `;

        // This command stops the coreaudiod process
        // This is necessary to restart the audio subsystem
        // const killCoreAudioCommand = "pkill coreaudiod";
        sudo.exec(command, { name: "Romeano" }, (error, stdout, stderr) => {
          if (error) {
            console.error("Error copying RomeanoAudioDriver.driver:", error);
            return;
          }

          console.log("RomeanoAudioDriver.driver copied successfully.");
        });

        // sudo.exec(
        //   killCoreAudioCommand,
        //   { name: "Romeano" },
        //   (error, stdout, stderr) => {
        //     if (error) {
        //       console.error(`Error executing command: ${error.message}`);
        //       return;
        //     }

        //     if (stderr) {
        //       console.error(`Command stderr: ${stderr}`);
        //       return;
        //     }

        //     console.log(`Command stdout: ${stdout}`);
        //   }
        // );
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
