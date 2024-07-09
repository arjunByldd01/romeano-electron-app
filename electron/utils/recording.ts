import path from "path";
const ffmpeg = require("fluent-ffmpeg");
import { BrowserWindow, app } from "electron";
import { fileURLToPath } from "node:url";
import schedule from "node-schedule";
import { IPC_EVENTS } from "../../src/lib/enums/ipc";
import { IMeeting } from "../../src/types/meeting";
import fs from "fs";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDev = process.env.NODE_ENV === "development";

const ffmpegPath = isDev
  ? require("ffmpeg-static") // Use ffmpeg-static in development
  : path.join(process.resourcesPath, "ffmpeg");

const onStopRecording = async () => {
  ffmpeg.setFfmpegPath(ffmpegPath);

  try {
    const fileDirectory = getCafAndOggFileDir();
    const { filePath: cafFilePath, fileName } = getFilePathWithExtension(
      fileDirectory,
      ".caf"
    );

    const cafFileName = fileName.split(".")[0];

    // const cafFilePath = path.join(getCafAndOggFileDir(), "romeanoaddon.caf");
    const outputFilePath = path.join(fileDirectory, `${cafFileName}.ogg`);
    await convertCafToOgg(cafFilePath, outputFilePath);
    const filePath = path.join(outputFilePath);
    const fileData = fs.readFileSync(filePath);

    fs.unlink(outputFilePath, (err) => {
      if (err) {
        console.error("Error deleting file", err);
      } else {
        console.log("File successfully deleted");
      }
    });
    return {
      fileData: fileData,
      fileName: `${cafFileName}.ogg`,
    };
  } catch (error) {
    console.log(error);
  }
};

async function convertCafToOgg(cafFilePath, outputFilePath) {
  return new Promise((resolve, reject) => {
    ffmpeg(cafFilePath)
      .audioCodec("libvorbis")
      .audioQuality(5) // Ensure using the correct audio codec
      // .audioBitrate("128k") // Set the audio bitrate
      .toFormat("ogg")
      .on("error", (err) => {
        reject(err);
      })
      .on("end", () => {
        resolve(outputFilePath);

        // fs.copyFile(cafFilePath, outputFilePath, (err) => {
        //   if (err) {
        //     console.error("Error copying file:", err);
        //   } else {
        //     console.log("File successfully copied to desktop!");
        //   }
        // });
        fs.unlink(cafFilePath, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(outputFilePath);
          }
        });
      })
      .save(outputFilePath);
  });
}

const getCafAndOggFileDir = () => {
  if (app.isPackaged) {
    // In production, the file is in the resources folder
    return process.resourcesPath;
  }
  // else {
  //   // In development, the file is in the app directory
  //   return app.getAppPath();
  // }
  return app.getPath("desktop");
};

function getFilePathWithExtension(dirPath: string, fileExtension: string) {
  try {
    const files = fs.readdirSync(dirPath);
    const file = files.find((f) => path.extname(f) === fileExtension);

    if (file) {
      return {
        fileName: file,
        filePath: path.join(dirPath, file),
      };
    } else {
      console.log("File not found");
      return null;
    }
  } catch (err) {
    console.error("Error reading directory:", err);
    return null;
  }
}
// Starts audio recording if there is an active meeting when the app opens
const startRecordingOnAppOpen = async ({
  activeMeeting,
  addonInstance,
  mainWindow,
}: {
  mainWindow: BrowserWindow;
  activeMeeting: IMeeting;
  addonInstance: any;
}) => {
  const recordingFileName = `${activeMeeting.summary}-recording.caf`;
  await addonInstance.startAudioControl(0);
  const filePath = getCafAndOggFileDir();
  await addonInstance.startRecording(path.join(filePath, recordingFileName));
  mainWindow.webContents.send(IPC_EVENTS.AUTO_RECORDING_ON);

  const endTime = activeMeeting.end;
  const endJobName = `${activeMeeting.id}-${activeMeeting.end}`;

  schedule.scheduleJob(`${endJobName}end`, endTime, async function () {
    addonInstance.stopRecording();
    // addonInstance.stopAudioControl();
    const dataToSend = await onStopRecording();
    mainWindow.webContents.send(IPC_EVENTS.AUTO_RECORDING_OFF, dataToSend);
  });
};

const scheduleRecordingTask = ({
  upcomingMeetings,
  addonInstance,
  mainWindow,
}: {
  mainWindow: BrowserWindow;
  upcomingMeetings: IMeeting[];
  addonInstance: any;
}) => {
  const scheduledJobs = schedule.scheduledJobs;

  upcomingMeetings.forEach((meeting) => {
    const scheduledMeeting = Object.keys(scheduledJobs).map((jobName) => {
      return jobName;
    });
    const startTime = meeting.start;
    const endTime = meeting.end;

    const startJobName = `${meeting.id}-${meeting.start}`;
    const endJobName = `${meeting.id}-${meeting.end}`;

    const recordingFileName = `${meeting.summary}-recording.caf`;
    if (!scheduledMeeting.includes(startJobName)) {
      schedule.scheduleJob(
        `${startJobName}start`,
        startTime,
        async function () {
          await addonInstance.startAudioControl(0);
          const filePath = getCafAndOggFileDir();
          await addonInstance.startRecording(
            path.join(filePath, recordingFileName)
          );
          mainWindow.webContents.send(IPC_EVENTS.AUTO_RECORDING_ON);
        }
      );
    }
    if (!scheduledMeeting.includes(endJobName)) {
      schedule.scheduleJob(`${endJobName}end`, endTime, async function () {
        addonInstance.stopRecording();
        // addonInstance.stopAudioControl();
        const dataToSend = await onStopRecording();
        mainWindow.webContents.send(IPC_EVENTS.AUTO_RECORDING_OFF, dataToSend);
      });
    }
  });
};

export {
  onStopRecording,
  getCafAndOggFileDir,
  startRecordingOnAppOpen,
  scheduleRecordingTask,
};
