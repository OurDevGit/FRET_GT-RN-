export const addPurchasedMedia = mediaId => ({
  type: "ADD_PURCHASED_MEDIA",
  payload: mediaId
});

export const setPurchasedMedia = payload => ({
  type: "SET_PURCHASED_MEDIA",
  payload
});
