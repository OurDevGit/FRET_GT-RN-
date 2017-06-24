import { List, Set } from 'immutable'

const markers = (state = List(), action) => {
  switch (action.type) {
    case 'UPDATE_MIDI_DATA':
      return  action.payload.markers
    default:
      return state
  }
}

const guitarTracks = (state = List(), action) => {
  switch (action.type) {
    case 'UPDATE_MIDI_DATA':
      return  action.payload.guitarTracks
    default:
      return state
  }
}

const tuningTracks = (state = List(), action) => {
  switch (action.type) {
    case 'UPDATE_MIDI_DATA':
      return  action.payload.tuningTracks
    default:
      return state
  }
}

const patterns = (state = List(), action) => {
  switch (action.type) {
    case 'UPDATE_MIDI_DATA':
      return  action.payload.patterns
    default:
      return state
  }
}

const notes = (state = Set(), action) => {
  switch (action.type) {
    case 'UPDATE_MIDI_FILE':
      return  action.payload.notes
    default:
      return state
  }
}

export default { markers, guitarTracks, tuningTracks, patterns, notes }