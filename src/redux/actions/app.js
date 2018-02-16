export const requestBootstrap = () => ({
  type: "REQUEST_BOOTSTRAP"
});

export const setBootstrap = payload => ({
  type: "SET_BOOTSTRAP",
  payload
});

export const presentModal = () => ({
  type: "PRESENT_MODAL"
});

export const dismissModal = () => ({
  type: "DISMISS_MODAL"
});

export const setAppClosing = bool => ({
  type: "APP_IS_CLOSING",
  payload: bool
});
