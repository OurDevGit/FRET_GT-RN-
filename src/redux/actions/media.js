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
