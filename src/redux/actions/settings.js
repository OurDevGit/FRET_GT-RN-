export const setCountdownTimerState = bool => {
  return {
    type: "SET_COUNTDOWN_TIMER_STATE",
    payload: bool
  };
};

export const setLeftHandState = bool => {
  return {
    type: "SET_LEFT_HAND_STATE",
    payload: bool
  };
};

export const setAutoPartSwitchingState = bool => {
  return {
    type: "SET_AUTO_PART_SWITCHING_STATE",
    payload: bool
  };
};
