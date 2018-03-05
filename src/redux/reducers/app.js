import Immutable from "immutable";

export const modalIsPresented = (state = false, action) => {
  switch (action.type) {
    case "PRESENT_MODAL":
      return true;
    case "DISMISS_MODAL":
      return false;
    default:
      return state;
  }
};

export const appIsClosing = (state = false, action) => {
  switch (action.type) {
    case "APP_IS_CLOSING":
      return action.payload;
    default:
      return state;
  }
};

export const appConfig = (state = Immutable.Map(), action) => {
  switch (action.type) {
    case "CONFIG_FETCH_SUCCEEDED":
      return Immutable.fromJS(action.payload);
    default:
      return state;
  }
};
