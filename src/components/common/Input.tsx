import React from "react";
import cn from "../../utils/className";
interface InputProps {
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLInputElement>
  ) => void;
  onPaste?: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  type?: string;
  value?: string | number;
  defaultValue?: string | number;
  dataTestId?: string;
}
const Input = ({
  onChange,
  className,
  onPaste,
  placeholder,
  type,
  value,
  defaultValue,
  dataTestId,
}: InputProps) => {
  return (
    <input
      defaultValue={defaultValue}
      type={type}
      data-testid={dataTestId}
      onChange={onChange}
      onPaste={onPaste}
      placeholder={placeholder}
      value={value}
      className={cn(
        "bg-transparent w-full h-full text-xs font-semibold ps-1 outline-none",
        className
      )}
    />
  );
};

export default Input;
