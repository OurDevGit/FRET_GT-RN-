import { makeStore } from "./StorageFactory";

const SyncStore = makeStore("ResourceSync");
const FilesStore = makeStore("ResourceFiles");

export const getSync = async resource => {
  const sync = await SyncStore.getObj(resource);
  return sync || 0;
};

export const setSync = async (resource, time) =>
  SyncStore.setObj(resource, time);

export const getFile = async resource => FilesStore.getObj(resource);

export const setFile = async (resource, file) =>
  FilesStore.setObj(resource, file);
