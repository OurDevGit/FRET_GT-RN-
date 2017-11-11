import { Map, fromJS } from "immutable";

export const downloadedMedia = (state = Map(), action) => {
  switch (action.type) {
    case "SET_DOWNLOADS": {
      const mapped = fromJS(action.payload);
      return mapped;
    }
    case "FINISH_DOWNLOAD": {
      const newEntry = fromJS({
        [action.payload.mediaId]: action.payload.details
      });
      const update = state.merge(newEntry);
      return update;
    }
    case "REMOVE_DOWNLOAD": {
      const mediaId = action.payload;
      return state.delete(mediaId);
    }
    case "DELETE_ALL_MEDIA":
      return Map();
    default:
      return state;
  }
};
