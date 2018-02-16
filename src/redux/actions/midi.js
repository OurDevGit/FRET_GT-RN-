export const updateMidiData = midi => ({
  type: "UPDATE_MIDI_DATA",
  payload: midi
});

export const clearMidiData = midi => ({
  type: "CLEAR_MIDI_DATA",
  payload: midi
});

export const updateVisibleTracks = tracks => ({
  type: "UPDATE_VISIBLE_TRACKS",
  payload: tracks
});

export const setSmartTrack = (track, isLeft) => ({
  type: "SET_SMART_TRACK",
  payload: { ...track, isLeft }
});

export const clearSmartTrack = () => ({
  type: "CLEAR_SMART_TRACK"
});

export const setChordsAndScales = bool => ({
  type: "SET_CHORDS_AND_SCALES",
  payload: bool
});

export const setJamBar = bool => ({
  type: "SET_JAMBAR",
  payload: bool
});
