import React, { useEffect, useRef, useState } from "react";
import cn from "../../utils/className";
import { type ISelectTagOption } from "../../types/meeting";
import { IoIosArrowDown, IoMdCheckmark } from "react-icons/io";
import { type IconType } from "react-icons";

type IDropdown = Pick<
  MicAndSpeakerDropDown,
  "onChange" | "options" | "value" | "defaultValue"
> & {
  defaultValue?: string | number;
};
type MicAndSpeakerDropDown = {
  options?: ISelectTagOption[];
  onChange?: ({ name, value }: ISelectTagOption) => void;
  prefixIcon: IconType;
  value?: string | number;
  defaultValue?: string | number;
};

function Dropdown({ options, onChange }: IDropdown) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownValue, setDropdownValue] = useState<ISelectTagOption>({
    name: "select",
    value: "select",
  });
  const parentRef = useRef(null);
  const childRef = useRef(null);

  useEffect(() => {
    if (parentRef.current && childRef.current) {
      const parentRect = parentRef.current.getBoundingClientRect();
      const childRect = childRef.current.getBoundingClientRect();

      // Calculate the available space above the parent for the child
      const topSpace = parentRect.top;

      // Adjust the child's position based on available space
      if (topSpace >= childRect.height) {
        // Position the child above the parent
        childRef.current.style.bottom = "100%";
        childRef.current.style.top = "auto";
      } else {
        // Position the child below the parent
        childRef.current.style.top = "100%";
        childRef.current.style.bottom = "auto";
      }
    }
  }, [isOpen]);

  const handleOptionSelect = (option: ISelectTagOption) => {
    setDropdownValue(option);
    setIsOpen(false);
    onChange(option);
  };

  //   function handleKeyDown() {}
  const onBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    const clickedOnOption =
      e.relatedTarget instanceof Element &&
      e.relatedTarget.classList.contains("custom-select-option");

    if (!clickedOnOption) {
      setIsOpen(false);
    }
  };
  return (
    <div
      onBlur={onBlur}
      className="relative w-full ps-2 font-sans font-medium  "
    >
      <button
        ref={parentRef}
        // role='button'
        // tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
        // onKeyDown={handleKeyDown}
        className="flex justify-between pr-2 items-center  w-full "
      >
        <p className="font-medium line-clamp-1   max-w-[90%]   text-start ">
          {" "}
          {dropdownValue?.name}
        </p>
        <IoIosArrowDown className="text-[14px]  " />
      </button>
      {isOpen && (
        <div
          ref={childRef}
          className="absolute border  bg-white  rounded-sm w-full max-h-[100px] overflow-y-scroll"
        >
          {options.map((ele, index) => (
            <button
              key={`${ele.name}${index}`}
              onClick={() => handleOptionSelect(ele)}
              className={cn(
                ` custom-select-option text-xs flex justify-between px-5 w-full  font-sans py-2 overflow-y-scroll max-h-[100px] hover:bg-[#F4F4F4] ${
                  ele.value == dropdownValue.value
                    ? "bg-violet-50  text-violet-500"
                    : "bg-white text-black"
                }`
              )}
            >
              <p className="line-clamp-1  max-w-[90%]  text-start">
                {" "}
                {ele.name}
              </p>

              {ele.value == dropdownValue.value && (
                <IoMdCheckmark className="text-[14px]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const MicAndSpeakerDropDown = ({
  prefixIcon: Icon,
  options,
  onChange,
}: MicAndSpeakerDropDown) => {
  return (
    <div className="flex items-center border-[#D9D9D9] border rounded pr-[11px] mt-2">
      <div className="bg-[#F4F4F4] px-2 py-2 border border-r-[#D9D9D9]">
        <Icon className="text-[20px]" />
      </div>
      <div className="w-full border-l h-full">
        <Dropdown options={options} onChange={onChange} />
      </div>
    </div>
  );
};

export { MicAndSpeakerDropDown };
