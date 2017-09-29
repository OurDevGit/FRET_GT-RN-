import { makeStore } from "./StorageFactory";

const Downloads = makeStore("Downloads");

export const getDownload = mediaId => {
  return Downloads.getObj(mediaId);
};

export const setDownload = async (mediaId, paths) => {
  try {
    await Downloads.setObj(mediaId, paths);
    return true;
  } catch (error) {
    return false;
  }
};
