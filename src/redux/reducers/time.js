import { Map } from "immutable";

exports.time = (state = 0, action) => {
  switch (action.type) {
    case "UPDATE_TIME":
      return action.payload;
    default:
      return state;
  }
};

exports.timeMidiOffset = (state = 0, action) => {
  switch (action.type) {
    case "SET_CURRENT_VIDEO_MIDI_FILE":
      return action.payload.get("begin");
    case "CLEAR_VIDEO_LESSON":
      return 0;
    default:
      return state;
  }
};
