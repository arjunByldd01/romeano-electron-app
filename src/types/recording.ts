import React from "react";

export interface IGetSignedUrlResponse {
  key: string;
  signedUrl: string;
}

export interface IProcessRecordingRequest {
  uploadKey: string;
  startTime: number;
  userAPIKey: string;
}

export interface IProcessRecordingResponse {
  recording: {
    id: string;
    uploadKey: string;
    service: string | null;
    startTime: string;
    endTime: string | null;
    isProcessed: boolean;
    processedData: unknown;
    metadata: unknown;
    createdAt: Date;
  };
}

export interface IRecordingDataFromMain {
  fileName: string;
  fileData: unknown;
}

export interface IRecordingContext {
  recordingStatus: string;
  setRecordingStatus?: React.Dispatch<React.SetStateAction<string>>;
}
