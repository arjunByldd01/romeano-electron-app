import React, { createContext, useContext, useEffect, useState } from "react";
import { RECORDING_STATUS } from "../lib/enums/meeting";
import { IRecordingContext } from "../types/recording";

const RecordingContext = createContext<IRecordingContext>({
  recordingStatus: RECORDING_STATUS.OFF,
});

export const useRecordingContext = () => useContext(RecordingContext);

const RecordingContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [recordingStatus, setRecordingStatus] = useState<string>(
    RECORDING_STATUS.OFF
  );

  const contextValue = {
    recordingStatus,
    setRecordingStatus,
  };
  return (
    <RecordingContext.Provider value={contextValue}>
      {children}
    </RecordingContext.Provider>
  );
};

export default RecordingContextProvider;
