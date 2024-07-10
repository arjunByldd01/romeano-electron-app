import { IpcRenderer } from "electron";
import { IPC_EVENTS } from "../lib/enums/ipc";
import { IRecordingDataFromMain } from "../types/recording";
import { ISelectTagOption } from "../types/meeting";
import { RECORDING_STATUS } from "../lib/enums/meeting";

const electron = window?.electron;
const ipcRenderer: IpcRenderer = electron?.ipcRenderer;

const acceptIpcEventFromMain = ({
  handleUploadRecording,
  setMicOptions,
  setRecordingStatus,
  refetchMeeting,
}) => {
  ipcRenderer?.on(
    IPC_EVENTS.UPLOAD_RECORDING,
    (event, data: IRecordingDataFromMain) => {
      handleUploadRecording(data);
    }
  );

  ipcRenderer?.on(
    IPC_EVENTS.MIC_OPTIONS_FROM_MAIN,
    (event, data: ISelectTagOption[]) => {
      setMicOptions(data);
    }
  );

  ipcRenderer?.on(
    IPC_EVENTS.AUTO_RECORDING_ON,
    (event, data: ISelectTagOption[]) => {
      setRecordingStatus(RECORDING_STATUS.ON);
      refetchMeeting();
    }
  );

  ipcRenderer?.on(
    IPC_EVENTS.AUTO_RECORDING_OFF,
    (event, data: IRecordingDataFromMain) => {
      handleUploadRecording(data);
      setRecordingStatus(RECORDING_STATUS.OFF);
      refetchMeeting();
    }
  );

  ipcRenderer?.on(IPC_EVENTS.AUDIO_DROVER_COPY, () => {
    refetchMeeting();
  });
};

export { acceptIpcEventFromMain };
