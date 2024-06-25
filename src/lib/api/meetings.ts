import { type IMeetingResponse } from "../../types/meeting";
import { AxiosError, type AxiosResponse } from "axios";
import { apiHeaders } from "../../utils/apiHeader";
import { apiClient } from "./api";
import { API_OPERATIONS } from "../enums/apiOperation";
import { handleApiError } from "../../utils/handleApiError";

export const getUserMeetings = async ({
  userAPIKey,
  setShowMeetingLoader,
  setSpinTheRefetchIcon,
}: {
  userAPIKey: string;
  setShowMeetingLoader: React.Dispatch<React.SetStateAction<boolean>>;
  setSpinTheRefetchIcon: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const headers = apiHeaders({ userAPIKey });
  try {
    const response: AxiosResponse<IMeetingResponse> = await apiClient.get(
      `google/external/calendar-events?external_only=true`,
      {
        headers,
      }
    );
    setShowMeetingLoader(false);
    setSpinTheRefetchIcon(false);
    return response.data;
  } catch (error) {
    setShowMeetingLoader(false);
    setSpinTheRefetchIcon(false);

    handleApiError(API_OPERATIONS.FETCH_USER_MEETING, error as AxiosError);
  }
};
