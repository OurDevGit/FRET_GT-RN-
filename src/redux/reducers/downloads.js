import { Map } from "immutable";

export const downloadProgress = (state = Map(), action) => {
  switch (action.type) {
    case "SET_DOWNLOAD_PROGRESS":
      return state.merge(action.payload);
    default:
      return state;
  }
};

export const downloadedMedia = (state = Map(), action) => {
  switch (action.type) {
    case "FINISH_DOWNLOAD":
      console.debug("reducing finished dl");
      console.debug({ action });
      return state.merge(action.payload);
    default:
      return state;
  }
};
