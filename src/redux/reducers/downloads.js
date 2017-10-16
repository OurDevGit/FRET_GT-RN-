import { Map, fromJS } from "immutable";

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
    case "SET_DOWNLOADS":
      const mapped = fromJS(action.payload);
      return mapped;
    case "FINISH_DOWNLOAD":
      console.debug("reducing finished dl");
      console.debug(action.payload);
      // action.payload
      return state.merge(action.payload);
    case "REMOVE_DOWNLOAD":
      const mediaId = action.payload;
      return state.delete(mediaId);
    default:
      return state;
  }
};
