import React from 'react';

interface IToggle {
  toggle: boolean;
  handleClick: () => void;
}

function Toggle({ toggle, handleClick }: IToggle) {
  return (
    <>
      <label className='autoSaverSwitch relative inline-flex cursor-pointer select-none items-center'>
        <input type='checkbox' name='autoSaver' className='sr-only' checked={toggle} onChange={handleClick} />
        <span
          className={`slider mr-1 flex h-[20px] w-[40px] items-center rounded-full p-1 duration-300 ${
            toggle ? ' bg-[#4040FF]' : 'bg-gray-400'
          }`}
        >
          <span
            className={`dot h-[14px] w-[14px] rounded-full bg-white duration-300 ${toggle ? 'translate-x-5' : ''}`}
          ></span>
        </span>
        {/* <span></span> */}
      </label>
    </>
  );
}

export default Toggle;
