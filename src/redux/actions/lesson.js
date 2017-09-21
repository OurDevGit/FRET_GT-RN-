export const setVideoChapters = chapters => ({
  type: "SET_VIDEO_CHAPTERS",
  payload: chapters
});

export const clearVideoChapters = () => ({
  type: "CLEAR_VIDEO_CHAPTERS"
});

export const setCurrentVideoChapter = chapter => ({
  type: "SET_CURRENT_VIDEO_CHAPTER",
  payload: chapter
});

export const clearCurrentVideoChapter = () => ({
  type: "CLEAR_CURRENT_VIDEO_CHAPTER"
});

export const setCurrentVideoMarker = marker => ({
  type: "SET_CURRENT_VIDEO_MARKER",
  payload: marker
});

export const clearCurrentVideoMarker = () => ({
  type: "CLEAR_CURRENT_VIDEO_MARKER"
});
