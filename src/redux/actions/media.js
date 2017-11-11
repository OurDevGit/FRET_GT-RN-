export const chooseMedia = mediaId => ({
  type: "CHOOSE_MEDIA",
  payload: mediaId
});

export const deleteMedia = media => ({
  type: "DELETE_MEDIA",
  payload: media
});

export const setIntermediate = (mediaId, isOn) => ({
  type: "SET_INTERMEDIATE",
  payload: { mediaId, isOn }
});

export const deleteAllMedia = () => ({
  type: "DELETE_ALL_MEDIA"
});
