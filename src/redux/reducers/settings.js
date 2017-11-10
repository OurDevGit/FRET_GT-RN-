exports.countdownTimerState = (state = false, action) => {
  switch (action.type) {
    case "SET_COUNTDOWN_TIMER_STATE":
      return action.payload;
    case "SET_BOOTSTRAP":
      return action.payload.countdownTimer;
    default:
      return state;
  }
};

exports.leftHandState = (state = false, action) => {
  switch (action.type) {
    case "SET_LEFT_HAND_STATE":
      return action.payload;
    case "SET_BOOTSTRAP":
      return action.payload.leftHanded;
    default:
      return state;
  }
};

exports.autoPartSwitchingState = (state = false, action) => {
  switch (action.type) {
    case "SET_AUTO_PART_SWITCHING_STATE":
      return action.payload;
    case "SET_BOOTSTRAP":
      return action.payload.autoPartSwitching;
    default:
      return state;
  }
};

exports.currentNotation = (state = "Flats", action) => {
  switch (action.type) {
    case "SET_CURRENT_NOTATION":
      return action.payload;
    case "SET_BOOTSTRAP":
      return action.payload.currentNotation;
    default:
      return state;
  }
};
