import { AxiosError, type AxiosResponse } from "axios";
import { apiHeaders } from "../../utils/apiHeader";
import { IUserResponse } from "../../types/user";
import { apiClient } from "./api";
import { handleApiError } from "../../utils/handleApiError";
import { API_OPERATIONS } from "../enums/apiOperation";

export const getUser = async ({ apiKey }: { apiKey: string }) => {
  try {
    const headers = apiHeaders({ userAPIKey: apiKey });

    const response: AxiosResponse<IUserResponse> = await apiClient.get(
      "users/external/me",
      {
        headers,
      }
    );

    return { apiData: response.data, apiKey };
  } catch (error) {
    handleApiError(API_OPERATIONS.FETCH_SIGNED_URL, error as AxiosError);
  }
};
