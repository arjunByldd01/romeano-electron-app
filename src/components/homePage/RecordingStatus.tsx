import React from "react";
import { RECORDING_STATUS } from "../../lib/enums/meeting";

const RecordingStatus = ({ recordingStatus }) => {
  if (recordingStatus == RECORDING_STATUS.ON) {
    return (
      <>
        <p className="bg-[#00DDB9] h-2 w-2 rounded-[50%] "></p>
        <p className="text-[10px] font-semibold">Actively recording</p>
      </>
    );
  }
  if (recordingStatus == RECORDING_STATUS.PAUSE) {
    return (
      <>
        <p className="bg-[#dd8500] h-2 w-2 rounded-[50%] "></p>
        <p className="text-[10px] font-semibold">Recording Paused</p>
      </>
    );
  }
  return <></>;
};

export default RecordingStatus;
