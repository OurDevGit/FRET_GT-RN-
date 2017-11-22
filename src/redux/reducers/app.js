export const modalIsPresented = (state = false, action) => {
  switch (action.type) {
    case "PRESENT_MODAL":
      return true;
    case "DISMISS_MODAL":
      return false;
    default:
      return state;
  }
};
