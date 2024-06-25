import { ELECTRON_STORE_KEY } from "../lib/enums/user";

export const getStoreItems = () => {
  const electronStore: IElectronStore = window?.electron?.store;

  const storeItems = {
    userAPIKey: electronStore.get(ELECTRON_STORE_KEY.USER_API_KEY) as string,
    userEmail: electronStore.get(ELECTRON_STORE_KEY.USER_EMAIL) as string,
  };
  return storeItems;
};
