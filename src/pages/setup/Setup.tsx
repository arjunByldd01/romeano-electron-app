import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Layout from "../../layouts/Layout";
import { getUser } from "../../lib/api/user";
import { UI_COMPONENT_DATA_TEST_ID } from "../../lib/enums/ui.";
import { LuKeyRound } from "react-icons/lu";
import Input from "../../components/common/Input";
import Spinner from "../../components/common/spinner";
import { useNavigate } from "react-router-dom";
import { useFetchMeetingsContext } from "../../context/fetchMeetingsContext";
import { IPC_EVENTS } from "../../lib/enums/ipc";
import { ELECTRON_STORE_KEY } from "../../lib/enums/user";
import { IUserResponse } from "../../types/user";

const electron = window?.electron;
const ipcRenderer = electron?.ipcRenderer;
const electronStore: IElectronStore = window?.electron?.store;

const Setup = () => {
  const [connectedTo, setConnectedTo] = useState<string>("");
  const navigate = useNavigate();
  const { onUserChange } = useFetchMeetingsContext();
  useEffect(() => {
    const height = document.body.scrollHeight;
    ipcRenderer?.send(IPC_EVENTS.RESIZE_SETUP_PAGE, height);
  }, []);

  const userMutation = useMutation({
    mutationFn: getUser,
    onSuccess: (
      data: { apiData: IUserResponse; apiKey: string } | undefined
    ) => {
      if (data) {
        setConnectedTo(data.apiData.user.email);
        electronStore.set(ELECTRON_STORE_KEY.USER_API_KEY, data.apiKey);
        electronStore.set(
          ELECTRON_STORE_KEY.USER_EMAIL,
          data.apiData.user.email
        );
        if (onUserChange) onUserChange(data.apiKey);
        // queryCache.clear();
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLInputElement>
  ) => {
    const { value } = e.target;
    if (value.length > 5) {
      userMutation.mutate({ apiKey: value });
    }
  };

  return (
    <Layout>
      <div className="bg-[#F5F5F5] min-h-[148px] text-black px-5 py-2 font-sans">
        <h2
          id="setup-page"
          className="text-sm max-h-[18px] font-bold mb-[15px]"
        >
          Setup
        </h2>
        <div className="flex gap-2 items-center font-sans">
          <p className="text-xs font-medium">API Key</p>
          {connectedTo && (
            <>
              <p className="bg-[#00DDB9] h-2 w-2 rounded-[50%] "></p>
              <p
                data-testid={UI_COMPONENT_DATA_TEST_ID.CONNECTED_TO_USER}
                className="text-[10px] font-semibold"
              >
                Connected to {connectedTo}
              </p>
            </>
          )}
        </div>
        <div className="flex items-center border-[#D9D9D9] border mt-2 rounded h-[37px] max-h-[37px] relative">
          <div className="bg-[#F4F4F4] px-2 py-2 border border-r-[#D9D9D9]">
            <LuKeyRound className="text-[18px]" />
          </div>
          <div className="w-full flex justify-between  border-l h-full relative">
            <Input
              defaultValue={
                (electronStore?.get(
                  ELECTRON_STORE_KEY.USER_API_KEY
                ) as string) || ""
              }
              onChange={handleChange}
              dataTestId={UI_COMPONENT_DATA_TEST_ID.API_INPUT_TAG}
              placeholder="Paste key here"
              className="bg-transparent w-full h-full text-xs font-semibold ps-1 outline-none placeholder:text-[11px] placeholder:font-normal"
            />
            {userMutation.isPending && (
              <div className="relative  w-[30px] flex items-center text-[16px]">
                <Spinner />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Setup;
