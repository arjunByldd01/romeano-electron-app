import React from 'react';
import cn from '../../utils/className';
interface IButttonProp {
  className?: string;
  children: React.ReactNode;
}
const Button = ({ children, className }: IButttonProp) => {
  return (
    <button
      className={cn(
        'bg-black w-full font-sans flex gap-1 justify-center text-white font-bold text-xs py-1 px-1 rounded',
        className,
      )}
    >
      {children}
    </button>
  );
};
export default Button;
