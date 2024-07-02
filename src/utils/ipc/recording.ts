import fs from "fs";
import path from "path";
const ffmpegStatic = require("ffmpeg-static");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
import { app } from "electron";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const onStartRecording = () => {
  try {
    const filePath = path.join(__dirname, "recording.ogg");
    fs.writeFileSync(filePath, "Recording started", "utf-8");
  } catch (error) {
    console.log(error);
  }
};

const onStopRecording = async () => {
  ffmpeg.setFfmpegPath(ffmpegPath);

  try {
    // const cafFilePath = path.join(app.getAppPath(), "romeanoaddon.caf");
    // const cafFilePath = path.join(getCafAndOggFilePath(), "romeanoaddon.caf");
    // const outputFilePath = path.join(getCafAndOggFilePath(), "recording.ogg");
    // await convertCafToOgg(cafFilePath, outputFilePath);
    // const filePath = path.join(outputFilePath);
    // const fileData = fs.readFileSync(filePath);
    // fs.unlinkSync(filePath);

    // const desktopPath = app.getPath("desktop");
    // const destinationPath = path.join(desktopPath, "romeanoaddon.caf");
    // fs.copyFile(cafFilePath, destinationPath, (err) => {
    //   if (err) {
    //     console.error("Error copying file:", err);
    //   } else {
    //     console.log("File successfully copied to desktop!");
    //   }
    // });
    // fs.unlink(cafFilePath, (err) => {
    //   if (err) {
    //     console.error("Error deleting file", err);
    //   } else {
    //     console.log("File successfully deleted");
    //   }
    // });
    // fs.unlink(outputFilePath, (err) => {
    //   if (err) {
    //     console.error("Error deleting file", err);
    //   } else {
    //     console.log("File successfully deleted");
    //   }
    // });
    return {
      fileData: "fileData",
      fileName: "recording.ogg",
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

        // const desktopPath = app.getPath("desktop");
        // const destinationPath = path.join(desktopPath, "romeanoaddon.caf");
        // fs.copyFile(cafFilePath, destinationPath, (err) => {
        //   if (err) {
        //     console.error("Error copying file:", err);
        //   } else {
        //     console.log("File successfully copied to desktop!");
        //   }
        // });
        // fs.unlink(cafFilePath, (err) => {
        //   if (err) {
        //     reject(err);
        //   } else {
        //     resolve(outputFilePath);
        //   }
        // });
      })
      .save(outputFilePath);
  });
}

const getCafAndOggFilePath = () => {
  // if (app.isPackaged) {
  //   // In production, the file is in the resources folder
  //   return process.resourcesPath;
  // } else {
  //   // In development, the file is in the app directory
  //   return app.getAppPath();
  // }
  return app.getPath("desktop");
};

export { onStartRecording, onStopRecording, getCafAndOggFilePath };
