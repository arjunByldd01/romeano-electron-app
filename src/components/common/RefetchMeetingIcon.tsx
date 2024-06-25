import React from "react";
import { LuRefreshCw } from "react-icons/lu";
import "../../index.css";
import { UI_COMPONENT_DATA_TEST_ID } from "../../lib/enums/ui.";

export interface IRefetchMeetingsIconProps {
  refetchMeetingsProps: {
    onRefetchMeeting: () => void;
    spinTheRefetchIcon: boolean;
    setSpinTheRefetchIcon: React.Dispatch<React.SetStateAction<boolean>>;
  };
}
const RefetchMeetingsIcon = ({
  refetchMeetingsProps,
}: IRefetchMeetingsIconProps) => {
  const onClickRefetch = () => {
    // to check if are on setup page then do no refetch meeting
    const setupPageElement = document.getElementById("setup-page");
    if (refetchMeetingsProps?.onRefetchMeeting && !setupPageElement) {
      refetchMeetingsProps?.onRefetchMeeting();
    }
  };
  return (
    <div>
      <LuRefreshCw
        onClick={onClickRefetch}
        data-testid={UI_COMPONENT_DATA_TEST_ID.REFETCH_ICON}
        className={`text-[20px] ${
          refetchMeetingsProps.spinTheRefetchIcon ? "rotate-icon" : ""
        }`}
      />
    </div>
  );
};
export default RefetchMeetingsIcon;
