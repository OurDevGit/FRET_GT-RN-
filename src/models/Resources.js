import { Dimensions } from "react-native";
import { makeStore } from "./StorageFactory";
import { getIsPhone } from "../utils";

const SyncStore = makeStore("ResourceSync");
const FilesStore = makeStore("ResourceFiles");

export const getSync = async resource => {
  const sync = await SyncStore.getObj(resource);
  return sync || 0;
};

export const setSync = async (resource, time) =>
  SyncStore.setObj(resource, time);

export const getFile = async resource => {
  console.debug(`getting ${resource}`);
  const file = await FilesStore.getObj(resource);
  console.debug({ file });
  return file;
};

export const setFile = async (resource, file) =>
  FilesStore.setObj(resource, file);

export const getLegal = () => getFile("legal.pdf");

export const getHelp = async () => {
  console.debug("get help!");
  const isPhone = getIsPhone();
  console.debug({ isPhone });
  const file = isPhone
    ? await getFile("help-iphone.pdf")
    : await getFile("help-ipad.pdf");
  console.debug({ file });

  return file;
};

export const getOverlay = () => {
  const isPhone = getIsPhone();
  return isPhone ? getFile("overlay-iphone.pdf") : getFile("overlay-ipad.pdf");
};
