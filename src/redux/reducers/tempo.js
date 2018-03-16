export const currentTempo = (state = 1, action) => {
  switch (action.type) {
    case "UPDATE_TEMPO":
      return action.payload;
    case "SET_CURRENT_MEDIA":
      return 1.0;
    default:
      return state;
  }
};
