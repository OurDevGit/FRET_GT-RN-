import { Map } from "immutable";

export const productDetails = (state = Map(), action) => {
  switch (action.type) {
    case "PRODUCT_DETAILS_LOADED":
      return state.merge(action.payload);
    default:
      return state;
  }
};
