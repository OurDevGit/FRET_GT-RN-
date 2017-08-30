import { Map } from "immutable";

exports.currentLoop = (state = Map(), action) => {
  switch (action.type) {
    case "SET_CURRENT_LOOP":
      return action.payload;
    case "CLEAR_CURRENT_LOOP" || "CLEAR_MIDI_DATA":
      return Map();
    default:
      return state;
  }
};

exports.loopIsEnabled = (state = true, action) => {
  switch (action.type) {
    case "ENABLE_LOOP":
      return action.payload;
    case "SET_CURRENT_LOOP":
      return true;
    case "DISABLE_LOOP":
      return false;
    default:
      return state;
  }
};
