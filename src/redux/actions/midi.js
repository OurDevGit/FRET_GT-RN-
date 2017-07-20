export const updateMidiData = midi => ({
  type: 'UPDATE_MIDI_DATA',
  payload: midi
})

export const clearMidiData = midi => ({
  type: 'CLEAR_MIDI_DATA',
  payload: midi
})