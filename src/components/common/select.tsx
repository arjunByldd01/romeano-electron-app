import React from 'react';
import { type ISelectTagOption } from '../../types/meeting';
import cn from '../../utils/className';

interface ISelect {
  options: ISelectTagOption[];
  value?: string | number;
  onChange?: ({ name, value }: ISelectTagOption) => void;
  className?: string;
  optionsClassName?: string;
}

function Select({ options, value, onChange, className, optionsClassName }: ISelect) {
  return (
    <select
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange({ name: e.target.name, value: e.target.value });
      }}
      value={value}
      className={cn('bg-transparent w-full h-full text-xs', className)}
    >
      {options.map((ele, index) => (
        <option key={`${ele.name}${index}`} className={cn('text-xs', optionsClassName)} value={ele.value}>
          {ele.name}
        </option>
      ))}
    </select>
  );
}

export default Select;
