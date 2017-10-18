export const toggleFavorite = mediaId => ({
  type: "TOGGLE_FAVORITE",
  payload: mediaId
});

export const setFavorites = mediaIds => ({
  type: "SET_FAVORITES",
  payload: mediaIds
});
