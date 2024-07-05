import { IpcRenderer } from "electron";
import { type IMeeting } from "../types/meeting";
import { type IApiError } from "./handleApiError";
import { IPC_EVENTS } from "../lib/enums/ipc";
import { RECORDING_STATUS } from "../lib/enums/meeting";
const electron = window?.electron;
const ipcRenderer: IpcRenderer = electron?.ipcRenderer;

export const getFilteredMeetings = ({
  userMeetings,
  fetchMeetingError,
  recordingStatus,
}: {
  userMeetings: IMeeting[] | undefined;
  fetchMeetingError: IApiError;
  recordingStatus: string;
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

  //to schedule auto recording on and off for upcoming Meeting
  ipcRenderer?.send(IPC_EVENTS.SCHEDULE_RECORDING_TASK, [
    ...filteredUpcomingMeetings,
  ]);

  //it start recording, when you open an app and recording is off but there is an active meeting,
  if (
    filteredActiveMeetings.length &&
    recordingStatus == RECORDING_STATUS.OFF
  ) {
    ipcRenderer?.send(
      IPC_EVENTS.RECORDING_ACTIVE_MEETING_ON_OPEN_APP,
      filteredActiveMeetings[0]
    );
  }

  return {
    filteredPastMeetings,
    filteredUpcomingMeetings,
    filteredActiveMeetings,
  };
};
