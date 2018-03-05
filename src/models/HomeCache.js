import { makeStore } from "./StorageFactory";

const HomeCache = makeStore("HomeCache");

export const getPages = async () => {
  let index = await HomeCache.getObj("INDEX");
  let firstRun = await HomeCache.getObj("FIRST_RUN");
  return { index, firstRun };
};

export const setPages = async (indexPath, firstRunPath) => {
  HomeCache.setObj("INDEX", indexPath);
  HomeCache.setObj("FIRST_RUN", firstRunPath);
};

export const getSync = async () => {
  const sync = await HomeCache.getObj("SYNC");
  return sync || 0;
};

export const setSync = time => HomeCache.setObj("SYNC", time);
