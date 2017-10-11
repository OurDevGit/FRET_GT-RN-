import Immutable from "immutable";

export const currentMedia = (state = null, action) => {
  switch (action.type) {
    case "SET_CURRENT_MEDIA":
      return action.payload;
    default:
      return state;
  }
};
