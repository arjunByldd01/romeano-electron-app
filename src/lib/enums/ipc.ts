export enum IPC_EVENTS {
  RESIZE_SETUP_PAGE = "RESIZE_SETUP_PAGE",
  RESIZE_HOME_PAGE = "RESIZE_HOME_PAGE",

  // electron store
  ELECTRON_STORE_GET = "electron-store-get",
  ELECTRON_STORE_SET = "electron-store-set",
  ELECTRON_STORE_DELETE = "electron-store-delete",

  // audio and recording
  MIC_CHANGED = "micChanged",
  MIC_OPTIONS_FROM_MAIN = "micOptionsFromMain",
  SEND_MIC_OPTIONS = "sendMicOptions",

  RECORDING_OFF = "recordingOff",
  RECORDING_ON = "recordingOn",
  RECORDING_PAUSE = "RECORDING_PAUSE",
  RECORDING_RESUME = "RECORDING_RESUME",
  UPLOAD_RECORDING = "uploadRecording",
}
