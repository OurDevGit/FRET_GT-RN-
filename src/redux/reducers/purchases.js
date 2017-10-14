import { Set } from "immutable";

export const purchasedMedia = (state = Set(), action) => {
  switch (action.type) {
    case "ADD_PURCHASED_MEDIA":
      return state.add(action.payload);
    case "SET_PURCHASED_MEDIA":
      return Set(action.payload);
    default:
      return state;
  }
};
