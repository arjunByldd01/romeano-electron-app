export interface IMeetingAttendees {
  email: string;
  self?: boolean;
  organizer?: boolean;
  responseStatus: string;
}
export interface IMeeting {
  id: string;
  creator: {
    email: string;
  };
  attendees: IMeetingAttendees[];
  iCalUID: string;
  summary: string;
  start?: Date | string;
  end?: Date | string;
}

export interface IMeetingResponse {
  events: IMeeting[];
}

export interface ISelectTagOption {
  name: string;
  value: string | number;
}

export interface IFetchMeetingContext {
  data: IMeetingResponse | undefined;
  onRefetchMeeting?: () => void;
  onUserChange?: (key: string) => void;
  isFetched?: boolean;
  error?: Error | null;
  showMeetingLoader?: boolean;
  setShowMeetingLoader?: React.Dispatch<React.SetStateAction<boolean>>;
  spinTheRefetchIcon?: boolean;
  setSpinTheRefetchIcon?: React.Dispatch<React.SetStateAction<boolean>>;
}
