import { Set } from "immutable";

export const purchasedMedia = (state = Set(), action) => {
  switch (action.type) {
    case "ADD_PURCHASED_MEDIA":
      return state.add(action.payload.toLowerCase());
    case "SET_PURCHASED_MEDIA":
      return Set(action.payload.map(m => m.toLowerCase()));
    default:
      return state;
  }
};
