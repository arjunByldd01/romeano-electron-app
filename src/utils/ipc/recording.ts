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
    const cafFilePath = path.join(app.getAppPath(), "romeanoaddon.caf");
    const outputDir = path.join(app.getAppPath());
    await convertCafToOgg(cafFilePath, outputDir);
    const filePath = path.join(app.getAppPath(), "recording.ogg");
    const fileData = fs.readFileSync(filePath);
    fs.unlinkSync(filePath);
    return {
      fileData,
      fileName: "recording.ogg",
    };
  } catch (error) {
    console.log(error);
  }
};

async function convertCafToOgg(cafFilePath, outputDir) {
  return new Promise((resolve, reject) => {
    const outputFilePath = path.join(outputDir, "recording.ogg");

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
export { onStartRecording, onStopRecording };
