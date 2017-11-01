export const updateGuitarSetting = guitar => ({
  type: "UPDATE_GUITAR",
  payload: guitar
});

export const guitarDisconnected = guitarId => ({
  type: "GUITAR_DISCONNECTED",
  payload: { guitarId }
});
