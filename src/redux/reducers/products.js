import { Map } from "immutable";

export const productDetails = (state = Map(), action) => {
  switch (action.type) {
    case "PRODUCT_DETAILS_LOADED":
      return state.merge(action.payload);
    case "SET_BOOTSTRAP":
      return state.merge(action.payload.productDetails);
    default:
      return state;
  }
};

export const productDetailsHaveLoaded = (state = false, action) => {
  switch (action.type) {
    case "PRODUCT_DETAILS_LOADED":
      return true;
    case "SET_BOOTSTRAP":
      return true;
    default:
      return state;
  }
};
