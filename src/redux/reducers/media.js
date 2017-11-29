import { Set } from "immutable";

export const intermediateMedia = (state = Set(), action) => {
  switch (action.type) {
    case "SET_INTERMEDIATE": {
      const { mediaId, isOn } = action.payload;
      return isOn === true ? state.add(mediaId) : state.delete(mediaId);
    }
    case "SET_CURRENT_MEDIA":
      return state.delete(action.payload);
    case "FINISH_DOWNLOAD":
      return state.delete(action.payload.mediaId);
    case "REMOVE_DOWNLOAD":
      return state.delete(action.payload);
    default:
      return state;
  }
};
