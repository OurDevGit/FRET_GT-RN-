import { Dimensions } from "react-native";
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

export const getLegal = () => getFile("legal.pdf");

export const getHelp = () => {
  const isPhone = Dimensions.get("window").width < 1024;
  return isPhone ? getFile("help-iphone.pdf") : getFile("help-ipad.pdf");
};

export const getOverlay = () => {
  const isPhone = Dimensions.get("window").width < 1024;
  return isPhone ? getFile("overlay-iphone.pdf") : getFile("overlay-ipad.pdf");
};
