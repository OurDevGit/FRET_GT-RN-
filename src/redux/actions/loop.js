export const enableLoop = bool => ({
  type: "ENABLE_LOOP",
  payload: bool
});

export const setCurrentLoop = loop => ({
  type: "SET_CURRENT_LOOP",
  payload: loop
});

export const clearCurrentLoop = () => ({
  type: "CLEAR_CURRENT_LOOP"
});
