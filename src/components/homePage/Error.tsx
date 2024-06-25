import React from 'react';
import { UI_COMPONENT_DATA_TEST_ID } from '../../lib/enums/ui.';

const Error = ({ message = 'Something went wrong' }: { message?: string }) => {
  return (
    <div data-testid={UI_COMPONENT_DATA_TEST_ID.ERROR_COMPONENT} className='flex  items-center my-1 font-medium '>
      <p className='font-medium text-sm'> {message} </p>
    </div>
  );
};

export default Error;
