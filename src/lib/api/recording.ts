import axios, { AxiosError, type AxiosResponse } from "axios";
import { apiHeaders } from "../../utils/apiHeader";
import {
  IGetSignedUrlResponse,
  IProcessRecordingResponse,
} from "../../types/recording";
import { apiClient } from "./api";
import { handleApiError } from "../../utils/handleApiError";
import { API_OPERATIONS } from "../enums/apiOperation";

export const getSignedCloudflareURL = async ({
  fileName,
  startTime,
  userAPIKey,
}: {
  fileName: string;
  startTime: number;
  userAPIKey: string;
}) => {
  const reqBody = {
    filename: fileName,
    startTime,
  };

  const headers = apiHeaders({ userAPIKey });

  try {
    const response: AxiosResponse<IGetSignedUrlResponse> = await apiClient.post(
      "recordings/external/signed-upload-url",
      reqBody,
      {
        headers,
      }
    );

    return response.data;
  } catch (error) {
    handleApiError(API_OPERATIONS.FETCH_SIGNED_URL, error as AxiosError);
  }
};

export const uploadRecordingFile = async ({
  signedUrl,
  userAPIKey,
  fileData,
}: {
  signedUrl: string | undefined;
  userAPIKey: string;
  fileData: unknown;
}) => {
  // const reqBody = file;
  const headers = apiHeaders({ userAPIKey });

  try {
    // This request not returning anything in response
    const response: AxiosResponse = await axios.put(signedUrl, fileData, {
      headers: { ...headers, "Content-Type": "audio/ogg" },
    });

    return response?.data;
  } catch (error) {
    handleApiError(API_OPERATIONS.UPLOAD_RECORDING, error as AxiosError);
  }
};

export const processRecording = async ({
  uploadKey,
  startTime,
  userAPIKey,
}: {
  uploadKey: string;
  startTime: number;
  userAPIKey: string;
}) => {
  const reqBody = {
    uploadKey,
    startTime,
  };

  const headers = apiHeaders({ userAPIKey });

  try {
    const response: AxiosResponse<IProcessRecordingResponse> =
      await apiClient.post("recordings/external/process-recording", reqBody, {
        headers,
      });

    return response.data;
  } catch (error) {
    handleApiError(API_OPERATIONS.PROCESS_RECORDING, error as AxiosError);
  }
};
