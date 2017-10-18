import { Set } from "immutable";

export const favorites = (state = Set(), action) => {
  switch (action.type) {
    case "TOGGLE_FAVORITE":
      if (state.includes(action.payload)) {
        return state.delete(action.payload);
      } else {
        return state.add(action.payload);
      }
    default:
      return state;
  }
};
