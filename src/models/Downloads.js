import { makeStore } from "./StorageFactory";

const Downloads = makeStore("Downloads");

export const getDownload = async mediaId => {
  const isDownloaded = await Downloads.getObj(mediaId);
  return isDownloaded === true ? true : false; // enforce we return only true or false (instead of null, etc. by accident)
};

export const setDownload = async mediaId => {
  try {
    await Downloads.setObj(mediaId, true);
    return true;
  } catch (error) {
    return false;
  }
};
