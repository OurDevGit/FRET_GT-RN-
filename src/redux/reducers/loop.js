import { Map } from "immutable";

export const currentLoop = (state = Map(), action) => {
  switch (action.type) {
    case "SET_CURRENT_LOOP":
      return action.payload;
    case "CLEAR_CURRENT_LOOP":
      return Map();
    case "CLEAR_MIDI_DATA":
      return Map();
    case "SET_CURRENT_MEDIA":
      return Map();
    default:
      return state;
  }
};

export const loopIsEnabled = (state = true, action) => {
  switch (action.type) {
    case "ENABLE_LOOP":
      return action.payload;
    case "SET_CURRENT_LOOP":
    case "SET_CURRENT_MEDIA":
      return true;
    case "DISABLE_LOOP":
      return false;
    default:
      return state;
  }
};
