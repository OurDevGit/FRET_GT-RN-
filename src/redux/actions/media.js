export const chooseMedia = media => ({
  type: "CHOOSE_MEDIA",
  payload: media
});

export const deleteMedia = media => {
  return {
    type: "DELETE_MEDIA",
    payload: media
  };
};
