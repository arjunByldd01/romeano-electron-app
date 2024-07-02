import { IpcRenderer } from "electron";
import { type IMeeting } from "../types/meeting";
import { type IApiError } from "./handleApiError";
import { IPC_EVENTS } from "../lib/enums/ipc";
const electron = window?.electron;
const ipcRenderer: IpcRenderer = electron?.ipcRenderer;

export const getFilteredMeetings = ({
  userMeetings,
  fetchMeetingError,
}: {
  userMeetings: IMeeting[] | undefined;
  fetchMeetingError: IApiError;
}) => {
  const currentTime = new Date();
  const currentDay = currentTime.getDate();
  const filteredPastMeetings: IMeeting[] = [];
  const filteredUpcomingMeetings: IMeeting[] = [];
  const filteredActiveMeetings: IMeeting[] = [];
  if (fetchMeetingError) {
    return {
      filteredPastMeetings,
      filteredUpcomingMeetings,
      filteredActiveMeetings,
    };
  }
  userMeetings?.forEach((meeting: IMeeting) => {
    const meetingEndTime = new Date(meeting.end);
    const meetingStartTime = new Date(meeting.start);

    if (meetingEndTime.getDate() === currentDay) {
      if (
        meetingEndTime.getTime() > currentTime.getTime() &&
        meetingStartTime.getTime() < currentTime.getTime()
      ) {
        filteredActiveMeetings.push(meeting);
      } else if (meetingEndTime.getTime() < currentTime.getTime()) {
        filteredPastMeetings.push(meeting);
      } else {
        filteredUpcomingMeetings.push(meeting);
      }
    }
  });

  ipcRenderer?.send(IPC_EVENTS.MEETINGS_FETCHED, [
    // ...filteredPastMeetings,
    ...filteredUpcomingMeetings,
    // ...filteredActiveMeetings,
  ]);

  return {
    filteredPastMeetings,
    filteredUpcomingMeetings,
    filteredActiveMeetings,
  };
};
