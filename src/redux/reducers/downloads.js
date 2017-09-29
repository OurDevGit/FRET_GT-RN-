import { Map } from "immutable";

export const downloadProgress = (state = Map(), action) => {
  switch (action.type) {
    case "SET_DOWNLOAD_PROGRESS":
      return state.merge(action.payload);
    default:
      return state;
  }
};
