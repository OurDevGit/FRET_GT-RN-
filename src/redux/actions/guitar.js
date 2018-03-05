export const updateGuitarSetting = guitar => ({
  type: "UPDATE_GUITAR",
  payload: guitar
});

export const guitarDisconnected = guitarId => ({
  type: "GUITAR_DISCONNECTED",
  payload: { guitarId }
});

export const assignAllGuitars = trackName => ({
  type: "ASSIGN_ALL_GUITARS",
  payload: { trackName }
});

export const toggleTuner = bool => ({
  type: "TOGGLE_TUNER",
  payload: bool
});

export const toggleBLEMenu = bool => ({
  type: "TOGGLE_BLE_MENU",
  payload: bool
});
