import React from 'react';
import { type IMeeting } from '../../types/meeting';
import { getTime } from '../../utils/getMeetingTime';
import { getMeetingResponseStatus } from '../../utils/getMeetingResponseStatus';
import { UI_COMPONENT_DATA_TEST_ID } from '../../lib/enums/ui.';

interface IActiveMeetingProps {
  meeting: IMeeting;
  userEmail: string;
}

const ActiveMeeting = ({ meeting, userEmail }: IActiveMeetingProps) => {
  let responseStatus: boolean;

  if (meeting.creator.email == userEmail) {
    responseStatus = true;
  } else {
    responseStatus = getMeetingResponseStatus({ meeting, userEmail: userEmail });
  }

  return (
    <div
      data-testid={UI_COMPONENT_DATA_TEST_ID.ACTIVE_MEETING_COMPONENT}
      className='flex  items-center  justify-between bg-violet-100 hover:bg-violet-200 rounded-md  mb-1 font-medium '
    >
      <div className='flex gap-2  font-medium  items-center'>
        <p
          className={` h-[19px] w-1 rounded-xl ${responseStatus ? 'bg-black' : 'border border-dashed border-black '} `}
        ></p>
        <p className='font-medium text-sm'>
          {getTime(meeting.start as Date)} {meeting?.summary}
        </p>
      </div>
      <div className='flex gap-2  items-center'>
        <p>Now</p>
      </div>
    </div>
  );
};

export default ActiveMeeting;
