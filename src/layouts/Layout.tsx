import React from "react";
import { LuSettings } from "react-icons/lu";
import { FiHome } from "react-icons/fi";
import { useNavigate } from "react-router";
import { getStoreItems } from "../utils/getStoreItems";
import { useFetchMeetingsContext } from "../context/fetchMeetingsContext";
import RefetchMeetingsIcon from "../components/common/RefetchMeetingIcon";
import { UI_COMPONENT_DATA_TEST_ID } from "../lib/enums/ui.";

interface ChildProps {
  children: React.ReactNode;
}

const Layout = ({ children }: ChildProps) => {
  const navigate = useNavigate();
  const onClickSettings = () => {
    navigate("/setup");
  };
  const onClickHome = () => {
    if (getStoreItems().userAPIKey) {
      navigate("/");
    }
  };
  const { onRefetchMeeting, setSpinTheRefetchIcon, spinTheRefetchIcon } =
    useFetchMeetingsContext();

  const refetchMeetingsProps = {
    onRefetchMeeting,
    setSpinTheRefetchIcon,
    spinTheRefetchIcon,
  };
  return (
    <>
      <div className="bg-white px-5 py-1 h-[53px] font-sans flex justify-between items-center text-black">
        <div>
          <h1 className=" text-lg font-semibold ">romeano</h1>
        </div>
        <div>
          <div className="flex gap-4 items-center ">
            <RefetchMeetingsIcon refetchMeetingsProps={refetchMeetingsProps} />
            <LuSettings
              data-testid={UI_COMPONENT_DATA_TEST_ID.SETTING_ICON}
              onClick={onClickSettings}
              className="text-[20px]"
            />
            <FiHome
              data-testid={UI_COMPONENT_DATA_TEST_ID.HOME_ICON}
              onClick={onClickHome}
              className="text-[20px]"
            />
          </div>
        </div>
      </div>
      {children}
    </>
  );
};

export default Layout;
