export enum MEETING_RESPONSE_STATUS {
  NEEDS_ACTION = "needsAction",
  ACCEPTED = "accepted",
  DECLINED = "declined",
}
export enum MEETING_ERROR {
  NOT_CONNECTED_GOOGLE = "No Google OAuth Credential found",
}

export enum MEETING_TYPE {
  UPCOMING_MEETING = "UPCOMING_MEETING",
  PAST_MEETING = "PAST_MEETING",
  ACTIVE_MEETING = "ACTIVE_MEETING",
}

export enum RECORDING_STATUS {
  ON = "ON",
  OFF = "OFF",
  PAUSE = "PAUSE",
  STOP = "STOP",
}
