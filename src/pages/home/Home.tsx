import React, { useEffect, useMemo, useRef, useState } from "react";
import { TbExternalLink } from "react-icons/tb";
import { LuMic } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { HiSpeakerWave } from "react-icons/hi2";
import { type IpcRenderer } from "electron";
import { useMutation } from "@tanstack/react-query";
import { CustomDropDown } from "../../components/common/DropDown";
import Toggle from "../../components/common/toggle";
import { IApiError, handleApiError } from "../../utils/handleApiError";
import Meetings from "../../components/homePage/Meetings";
import Layout from "../../layouts/Layout";
import { API_OPERATIONS } from "../../lib/enums/apiOperation";
import { AxiosError } from "axios";
import {
  IGetSignedUrlResponse,
  IRecordingDataFromMain,
} from "../../types/recording";
import { ISelectTagOption } from "../../types/meeting";
import { IPC_EVENTS } from "../../lib/enums/ipc";
import { getFilteredMeetings } from "../../utils/getFilteredMeetings";
import { getStoreItems } from "../../utils/getStoreItems";
import {
  getSignedCloudflareURL,
  processRecording,
  uploadRecordingFile,
} from "../../lib/api/recording";
import { useFetchMeetingsContext } from "../../context/fetchMeetingsContext";
import { RECORDING_STATUS } from "../../lib/enums/meeting";
import RecordingStatus from "../../components/homePage/RecordingStatus";
import { useRecordingContext } from "../../context/recordingContext";

const electron = window?.electron;
const ipcRenderer: IpcRenderer = electron?.ipcRenderer;
const shell = electron?.shell;

function Home() {
  const {
    data: userMeetings,
    isFetched: isMeetingFetched,
    error: fetchMeetingError,
    showMeetingLoader,
    refetchMeeting,
    isRefetching: isRefetchingMeetings,
  } = useFetchMeetingsContext();

  const { recordingStatus, setRecordingStatus } = useRecordingContext();
  // const [, setRecordingStatus] = useState<string>(RECORDING_STATUS.OFF);

  const [micOptions, setMicOptions] = useState<ISelectTagOption[]>([
    {
      name: "Same as System (Mac Book Air Microphone)",
      value: "macbookProMicrophone",
    },
    { name: "MacBook  Microphone", value: "macbookMicrophone" },
    { name: "MacBook  Microphone", value: "macbookicrophone" },
    { name: "MacBook  Microphone", value: "macbookMcrophone" },
  ]);

  const { userAPIKey, userEmail }: { userAPIKey: string; userEmail: string } =
    getStoreItems();
  const navigate = useNavigate();
  const pageRef = useRef<HTMLDivElement>();
  const navbarHeight = 54;

  const uploadRecordingMutation = useMutation({
    mutationFn: getSignedCloudflareURL,
  });

  const processRecordingMutation = useMutation({
    mutationFn: processRecording,
  });

  useEffect(() => {
    ipcRenderer?.on(
      IPC_EVENTS.UPLOAD_RECORDING,
      (event, data: IRecordingDataFromMain) => {
        handleUploadRecording(data);
      }
    );

    ipcRenderer?.on(
      IPC_EVENTS.MIC_OPTIONS_FROM_MAIN,
      (event, data: ISelectTagOption[]) => {
        setMicOptions(data);
      }
    );

    ipcRenderer?.on(
      IPC_EVENTS.AUTO_RECORDING_ON,
      (event, data: ISelectTagOption[]) => {
        setRecordingStatus(RECORDING_STATUS.ON);
        refetchMeeting();
      }
    );

    ipcRenderer?.on(
      IPC_EVENTS.AUTO_RECORDING_OFF,
      (event, data: IRecordingDataFromMain) => {
        handleUploadRecording(data);
        setRecordingStatus(RECORDING_STATUS.OFF);
      }
    );

    if (!userAPIKey) {
      navigate("/setup");
    }
  }, []);

  const {
    filteredActiveMeetings,
    filteredUpcomingMeetings,
    filteredPastMeetings,
  } = useMemo(() => {
    return getFilteredMeetings({
      userMeetings: userMeetings?.events,
      fetchMeetingError: fetchMeetingError as IApiError,
    });
  }, [
    isMeetingFetched,
    userMeetings?.events,
    fetchMeetingError,
    isRefetchingMeetings,
  ]);

  useEffect(() => {
    let pageHeight = pageRef.current?.getBoundingClientRect()?.height;
    if (pageHeight) {
      // adding layout(navbar) height to page height
      pageHeight += navbarHeight;
    } else {
      pageHeight = document.body.scrollHeight;
    }

    ipcRenderer?.send(IPC_EVENTS.RESIZE_HOME_PAGE, pageHeight);
  }, [
    showMeetingLoader,
    filteredUpcomingMeetings,
    filteredPastMeetings,
    filteredActiveMeetings,
  ]);

  const navigateToRomeano = () => {
    shell.openExternal("https://calendar.google.com/calendar");
  };

  const toggleRecording = () => {
    if (
      recordingStatus == RECORDING_STATUS.ON &&
      filteredActiveMeetings.length
    ) {
      ipcRenderer?.send(IPC_EVENTS.RECORDING_PAUSE);
      setRecordingStatus(RECORDING_STATUS.PAUSE);

      // ipcRenderer?.send(IPC_EVENTS.RECORDING_OFF);
      // setRecordingStatus(RECORDING_STATUS.OFF);
    } else if (
      recordingStatus == RECORDING_STATUS.ON &&
      !filteredActiveMeetings.length
    ) {
      ipcRenderer?.send(IPC_EVENTS.RECORDING_OFF);
      setRecordingStatus(RECORDING_STATUS.OFF);
    } else if (
      recordingStatus == RECORDING_STATUS.PAUSE &&
      filteredActiveMeetings.length
    ) {
      ipcRenderer?.send(IPC_EVENTS.RECORDING_RESUME);
      setRecordingStatus(RECORDING_STATUS.ON);
    } else if (
      recordingStatus == RECORDING_STATUS.PAUSE &&
      !filteredActiveMeetings.length
    ) {
      ipcRenderer?.send(IPC_EVENTS.RECORDING_OFF);
      setRecordingStatus(RECORDING_STATUS.OFF);
    } else {
      ipcRenderer?.send(IPC_EVENTS.RECORDING_ON);
      setRecordingStatus(RECORDING_STATUS.ON);
    }
  };

  const onChangeMic = ({ value }: ISelectTagOption) => {
    ipcRenderer?.send(IPC_EVENTS.MIC_CHANGED, value);
  };

  const handleUploadRecording = async (data: IRecordingDataFromMain) => {
    try {
      const startTime = new Date().getTime();
      const result: IGetSignedUrlResponse =
        await uploadRecordingMutation.mutateAsync({
          fileName: data?.fileName,
          startTime,
          userAPIKey,
        });

      const signedUrl = result?.signedUrl;
      await uploadRecordingFile({
        signedUrl,
        userAPIKey,
        fileData: data.fileData,
      });
      await processRecordingMutation.mutateAsync({
        uploadKey: result.key,
        startTime,
        userAPIKey,
      });
    } catch (error) {
      handleApiError(
        API_OPERATIONS.UPLOAD_RECORDING_OPERATION,
        error as AxiosError
      );
    }
  };

  return (
    <Layout>
      <div ref={pageRef} className="  text-black  font-sans ">
        {/* meetings */}
        <div className="bg-[#F5F5F5] px-5 py-2 flex flex-col gap-3 max-h-[456px]  ">
          <div>
            <Meetings
              pastMeetings={filteredPastMeetings}
              userMeetings={userMeetings?.events}
              upcomingMeetings={filteredUpcomingMeetings}
              activeMeetings={filteredActiveMeetings}
              userEmail={userEmail}
              fetchMeetingError={fetchMeetingError as IApiError}
              showMeetingLoader={showMeetingLoader}
            />
          </div>
          <div>
            <button
              onClick={navigateToRomeano}
              className="bg-black w-full font-sans flex gap-1 justify-center text-white font-bold text-xs py-2 rounded"
            >
              My Meetings <TbExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* recording */}
        <div className="px-5 py-2 max-h-[210px] min-h-[210px]  ">
          <h1 className="font-bold text-[18px] mb-[10px]">Recording</h1>
          <div>
            <div className="flex justify-between it">
              <div className="flex gap-2 items-center font-sans">
                <p className="text-xs font-semibold">Microphone</p>
                <RecordingStatus recordingStatus={recordingStatus} />
              </div>
              <div>
                <Toggle
                  handleClick={toggleRecording}
                  toggle={recordingStatus == RECORDING_STATUS.ON}
                />
              </div>
            </div>

            <CustomDropDown
              prefixIcon={LuMic}
              options={micOptions}
              onChange={onChangeMic}
            />
          </div>

          <div className="mt-2">
            <div className="flex justify-between it">
              <div className="flex gap-2 items-center font-sans">
                <p className="text-xs font-semibold">Speaker</p>
              </div>
            </div>
            <CustomDropDown
              prefixIcon={HiSpeakerWave}
              options={micOptions}
              onChange={onChangeMic}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
