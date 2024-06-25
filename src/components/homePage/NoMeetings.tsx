import React from 'react';
import { UI_COMPONENT_DATA_TEST_ID } from '../../lib/enums/ui.';

export const NoMeetingsForTheDay: () => React.JSX.Element = () => {
  return (
    <div
      data-testid={UI_COMPONENT_DATA_TEST_ID.NO_MEETING_FOR_THE_DAY}
      className='flex  items-center my-1 font-medium '
    >
      <p className='font-medium text-sm'> No meetigs for today </p>
    </div>
  );
};

export const NoUpcomingMeetings = () => {
  return (
    <p data-testid={UI_COMPONENT_DATA_TEST_ID.ALL_DONE_FOR_TODAY} className='font-bold mb-3 text-sm'>
      All done for today ✅
    </p>
  );
};
