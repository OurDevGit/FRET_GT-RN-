export const downloadProgress = payload => ({
  type: "SET_DOWNLOAD_PROGRESS",
  payload
});

export const finishDownload = payload => ({
  type: "FINISH_DOWNLOAD",
  payload
});
