import { makeStore } from "./StorageFactory";

const HomeCache = makeStore("HomeCache");

export const getIndex = async () => HomeCache.getObj("INDEX");

export const setIndex = async index => HomeCache.setObj("INDEX", index);

export const getSync = async () => {
  const sync = await HomeCache.getObj("SYNC");
  console.debug({ sync });
  return sync || 0;
};

export const setSync = time => HomeCache.setObj("SYNC", time);
