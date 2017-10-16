export const chooseMedia = media => ({
  type: "CHOOSE_MEDIA",
  payload: media
});

export const deleteMedia = media => {
  console.debug("deleteMedia");
  console.debug(media);
  return {
    type: "DELETE_MEDIA",
    payload: media
  };
};
