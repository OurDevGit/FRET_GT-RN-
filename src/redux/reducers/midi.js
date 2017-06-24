import { List, Set } from 'immutable'

exports.markers = (state = List(), action) => {
  switch (action.type) {
    case 'UPDATE_MIDI_DATA':
      return  action.payload.markers
    default:
      return state
  }
}

exports.guitarTracks = (state = List(), action) => {
  switch (action.type) {
    case 'UPDATE_MIDI_DATA':
      return  action.payload.guitarTracks
    default:
      return state
  }
}

exports.tuningTracks = (state = List(), action) => {
  switch (action.type) {
    case 'UPDATE_MIDI_DATA':
      return  action.payload.tuningTracks
    default:
      return state
  }
}

exports.patterns = (state = List(), action) => {
  switch (action.type) {
    case 'UPDATE_MIDI_DATA':
      return  action.payload.patterns
    default:
      return state
  }
}

exports.notes = (state = Set(), action) => {
  switch (action.type) {
    case 'UPDATE_MIDI_FILE':
      return  action.payload.notes
    default:
      return state
  }
}
