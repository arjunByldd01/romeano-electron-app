import { useEffect } from 'react';
import { type RendererListener } from '../../preload';

const electron = window?.electron;

export const useRendererListener = (channel: string, listener: RendererListener) => {
  useEffect(() => {
    electron?.ipcRenderer?.on(channel, listener);
    return () => {
      electron?.ipcRenderer?.removeListener(channel, listener);
    };
  }, []);
};
