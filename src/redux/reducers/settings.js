exports.countdownTimerState = (state = false, action) => {
  switch (action.type) {
    case "SET_COUNTDOWN_TIMER_STATE":
      return action.payload;
    default:
      return state;
  }
};

exports.leftHandState = (state = false, action) => {
  switch (action.type) {
    case "SET_LEFT_HAND_STATE":
      return action.payload;
    default:
      return state;
  }
};

exports.autoPartSwitchingState = (state = false, action) => {
  switch (action.type) {
    case "SET_AUTO_PART_SWITCHING_STATE":
      return action.payload;
    default:
      return state;
  }
};
