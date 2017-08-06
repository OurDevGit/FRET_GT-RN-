exports.currentLoop = (state = undefined, action) => {
  switch (action.type) {
    case "SET_CURRENT_LOOP":
      return action.payload;
    case ("CLEAR_CURRENT_LOOP", "CLEAR_MIDI_DATA"):
      return undefined;
    default:
      return state;
  }
};

exports.loopIsActive = (state = false, action) => {
  switch (action.type) {
    case ("ENABLE_LOOP", "SET_CURRENT_LOOP"):
      return true;
    case "DISABLE_LOOP":
      return false;
    default:
      return state;
  }
};
