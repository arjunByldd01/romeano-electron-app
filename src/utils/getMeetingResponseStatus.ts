import { MEETING_RESPONSE_STATUS } from '../lib/enums/meeting';
import { type IMeeting } from '../types/meeting';

export const getMeetingResponseStatus = ({ meeting, userEmail }: { meeting: IMeeting; userEmail: string }) => {
  if (meeting.creator.email == userEmail) {
    return true;
  }

  return meeting?.attendees.some(
    (attendee) => attendee.responseStatus === MEETING_RESPONSE_STATUS.ACCEPTED && attendee.email == userEmail,
  );
};
