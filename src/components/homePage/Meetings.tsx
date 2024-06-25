import React from "react";
import { type IMeeting } from "../../types/meeting";
import Meeting from "./Meeting";
import { NoMeetingsForTheDay, NoUpcomingMeetings } from "./NoMeetings";
import Spinner from "../common/spinner";
import { MEETING_ERROR } from "../../lib/enums/meeting";
import ActiveMeeting from "./ActiveMeeting";
import { type IApiError } from "../..//utils/handleApiError";
import Error from "./Error";
import { UI_COMPONENT_DATA_TEST_ID } from "../../lib/enums/ui.";

interface MeetingsProps {
  upcomingMeetings: IMeeting[];
  pastMeetings: IMeeting[];
  userMeetings: IMeeting[];
  activeMeetings: IMeeting[];
  userEmail: string;
  fetchMeetingError: IApiError;
  showMeetingLoader: boolean;
}

const Meetings = ({
  upcomingMeetings,
  pastMeetings,
  userMeetings,
  activeMeetings,
  userEmail,
  fetchMeetingError,
  showMeetingLoader,
}: MeetingsProps) => {
  if (showMeetingLoader) {
    return (
      <div className="relative h-32 text-[24px] ">
        <Spinner />
      </div>
    );
  }

  if (
    fetchMeetingError &&
    fetchMeetingError?.data != MEETING_ERROR.NOT_CONNECTED_GOOGLE
  ) {
    return <Error />;
  }

  if (
    userMeetings?.length == 0 ||
    (upcomingMeetings.length == 0 &&
      activeMeetings.length == 0 &&
      pastMeetings.length == 0)
  ) {
    return <NoMeetingsForTheDay />;
  }

  return (
    <div className="max-h-[192px] overflow-y-scroll">
      <div>
        {activeMeetings?.map((ele: IMeeting) => (
          <ActiveMeeting key={ele.id} meeting={ele} userEmail={userEmail} />
        ))}
      </div>

      <div>
        {upcomingMeetings?.length > 0 ? (
          <>
            <h2 className="font-bold text-sm mb-[5px]">Upcoming meetings</h2>
            {upcomingMeetings?.map((ele: IMeeting) => (
              <Meeting
                dataTestId={
                  UI_COMPONENT_DATA_TEST_ID.UPCOMING_MEETING_COMPONENT
                }
                key={ele.id}
                meeting={ele}
                userEmail={userEmail}
              />
            ))}
          </>
        ) : (
          <>
            <NoUpcomingMeetings />
          </>
        )}
      </div>
      <div className="text-[#858585]">
        {pastMeetings?.length > 0 && (
          <>
            <h2 className="font-bold text-sm mb-[5px] mt-[10px]">
              Past meetings 🎉
            </h2>

            {pastMeetings?.map((ele: IMeeting) => (
              <Meeting
                dataTestId={UI_COMPONENT_DATA_TEST_ID.PAST_MEETING_COMPONENT}
                key={ele.id}
                meeting={ele}
                userEmail={userEmail}
              />
            ))}
          </>
        )}
        {/* <NoPastEmptyMeetings /> */}
      </div>
    </div>
  );
};

export default Meetings;
