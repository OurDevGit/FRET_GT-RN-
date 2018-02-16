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
