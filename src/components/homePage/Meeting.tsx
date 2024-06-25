import React from 'react';
import { type IMeeting } from '../../types/meeting';
import { getTime } from '../../utils/getMeetingTime';
import { getMeetingResponseStatus } from '../../utils/getMeetingResponseStatus';

interface MeetingProps {
  meeting: IMeeting;
  userEmail: string;
  dataTestId?: string;
}

const Meeting = ({ meeting, userEmail, dataTestId }: MeetingProps) => {
  const responseStatus = getMeetingResponseStatus({ meeting, userEmail });

  return (
    <div data-testid={dataTestId} className='flex gap-2 mb-1 font-medium '>
      <p
        className={` h-[19px] w-1 rounded-xl ${responseStatus ? 'bg-black' : 'border border-dashed border-black '} `}
      ></p>
      <p className='font-medium text-sm'>
        {getTime(meeting.start as Date)} {meeting?.summary}
      </p>
    </div>
  );
};

export default Meeting;
