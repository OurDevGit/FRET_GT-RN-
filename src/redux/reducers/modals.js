import { Map } from "immutable";

exports.saveLoopModal = (state = null, action) => {
  switch (action.type) {
    case "PRESENT_SAVE_LOOP_MODAL":
      return action.payload;
    case "DISMISS_SAVE_LOOP_MODAL":
      return null;
    default:
      return state;
  }
};
