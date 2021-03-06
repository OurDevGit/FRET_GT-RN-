export const finishDownload = (mediaId, details) => ({
  type: "FINISH_DOWNLOAD",
  payload: { mediaId, details }
});

export const setDownloads = payload => ({
  type: "SET_DOWNLOADS",
  payload
});

export const removeDownload = mediaId => ({
  type: "REMOVE_DOWNLOAD",
  payload: mediaId
});
