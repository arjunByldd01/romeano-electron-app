import React, { createContext, useContext, useEffect, useState } from "react";
import { useFetchMeetings } from "../hooks/useFetchMeeting";
import { IFetchMeetingContext } from "../types/meeting";
import { getStoreItems } from "../utils/getStoreItems";

const FetchMeetingsContext = createContext<IFetchMeetingContext>({
  data: { events: [] },
});

export const useFetchMeetingsContext = () => useContext(FetchMeetingsContext);

const FetchMeetingsContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { userAPIKey }: { userAPIKey: string; userEmail: string } =
    getStoreItems();

  const [userAPIKeyContextState, setUserAPIkeyContextState] =
    useState(userAPIKey);

  const [showMeetingLoader, setShowMeetingLoader] = useState(false);
  const [spinTheRefetchIcon, setSpinTheRefetchIcon] = useState(false);

  const { data, refetch, isFetched, error } = useFetchMeetings({
    userAPIKey: userAPIKeyContextState,
    setShowMeetingLoader,
    setSpinTheRefetchIcon,
  });

  const onRefetchMeeting = () => {
    setSpinTheRefetchIcon(true);

    refetch();
  };

  const onUserChange = (key: string) => {
    setUserAPIkeyContextState(key);
  };

  useEffect(() => {
    // show meeting loader when user api key changed or user navigating to home page after entering his api key
    setShowMeetingLoader(true);
    refetch();
  }, [userAPIKeyContextState]);

  const contextValue = {
    data,
    onRefetchMeeting,
    isFetched,
    error,
    onUserChange,
    showMeetingLoader,
    setShowMeetingLoader,
    spinTheRefetchIcon,
    setSpinTheRefetchIcon,
  };
  return (
    <FetchMeetingsContext.Provider value={contextValue}>
      {children}
    </FetchMeetingsContext.Provider>
  );
};

export default FetchMeetingsContextProvider;
