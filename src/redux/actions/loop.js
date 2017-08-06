export const enableLoop = () => ({
  type: "ENABLE_LOOP"
});

export const disableLoop = () => ({
  type: "DISABLE_LOOP"
});

export const setCurrentLoop = loop => ({
  type: "SET_CURRENT_LOOP",
  payload: loop
});

export const clearCurrentLoop = () => ({
  type: "CLEAR_CURRENT_LOOP"
});
