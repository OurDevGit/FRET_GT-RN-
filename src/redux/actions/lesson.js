export const setVideoChapters = chapters => ({
  type: "SET_VIDEO_CHAPTERS",
  payload: chapters
});

export const setVideoMidiFiles = midi => ({
  type: "SET_VIDEO_MIDI_FILES",
  payload: midi
});

export const setCurrentVideoChapter = chapter => ({
  type: "SET_CURRENT_VIDEO_CHAPTER",
  payload: chapter
});

export const setCurrentVideoMarker = marker => ({
  type: "SET_CURRENT_VIDEO_MARKER",
  payload: marker
});

export const setCurrentVideoMidiFile = midi => ({
  type: "SET_CURRENT_VIDEO_MIDI_FILE",
  payload: midi
});

export const clearVideoLesson = () => ({
  type: "CLEAR_VIDEO_LESSON"
});
