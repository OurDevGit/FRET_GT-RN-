import { List } from 'immutable'

exports.markers = (state = List(), action) => {
  switch (action.type) {
    case 'UPDATE_MIDI_DATA':
      return  List(action.payload.markers)
    default:
      return state
  }
}

exports.guitarTracks = (state = List(), action) => {
  switch (action.type) {
    case 'UPDATE_MIDI_DATA':
      return  List(action.payload.guitarTracks)
    default:
      return state
  }
}

exports.tuningTracks = (state = List(), action) => {
  switch (action.type) {
    case 'UPDATE_MIDI_DATA':
      return  List(action.payload.tuningTracks)
    default:
      return state
  }
}

exports.patterns = (state = List(), action) => {
  switch (action.type) {
    case 'UPDATE_MIDI_DATA':
      return  List(action.payload.patterns)
    default:
      return state
  }
}
