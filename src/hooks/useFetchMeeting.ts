import { getUserMeetings } from "../lib/api/meetings";
import { QUERY_KEY } from "../lib/enums/user";
import { useQuery } from "@tanstack/react-query";

export const useFetchMeetings = ({
  userAPIKey,
  setShowMeetingLoader,
  setSpinTheRefetchIcon,
}: {
  userAPIKey: string;
  setShowMeetingLoader?: React.Dispatch<React.SetStateAction<boolean>>;
  setSpinTheRefetchIcon?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return useQuery({
    queryKey: [QUERY_KEY.GET_MEETINGS],
    queryFn: () =>
      getUserMeetings({
        userAPIKey,
        setShowMeetingLoader,
        setSpinTheRefetchIcon,
      }),
    // refetchOnWindowFocus: false,
    retry: false,
  });
};
