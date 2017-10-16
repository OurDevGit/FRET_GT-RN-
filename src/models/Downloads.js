import { makeStore } from "./StorageFactory";

const Downloads = makeStore("Downloads");

export const getDownload = mediaId => {
  return Downloads.getObj(mediaId);
};

export const getAllDownloads = async () => {
  const allKeys = await Downloads.getAllKeys();
  const allObjs = await Downloads.getObjs(allKeys);

  return allObjs;
};

export const setDownload = async (mediaId, details) => {
  try {
    await Downloads.setObj(mediaId, details);
    return true;
  } catch (error) {
    return false;
  }
};

export const removeDownload = async mediaId => {};
