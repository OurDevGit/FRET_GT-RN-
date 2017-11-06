export const chooseMedia = mediaId => ({
  type: "CHOOSE_MEDIA",
  payload: mediaId
});

export const deleteMedia = media => {
  return {
    type: "DELETE_MEDIA",
    payload: media
  };
};

export const setIntermediate = (mediaId, isOn) => ({
  type: "SET_INTERMEDIATE",
  payload: { mediaId, isOn }
});
