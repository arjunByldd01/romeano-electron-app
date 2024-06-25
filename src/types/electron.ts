interface IElectronStore {
  get: (key: string) => unknown;
  set: (key: string, val: unknown) => void;
  delete: (key: string) => void;
}
