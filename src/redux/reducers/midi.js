import { List } from 'immutable'

exports.markers = (state = List(), action) => {
  switch (action.type) {
    case 'UPDATE_MIDI_DATA':
      return  List(action.payload.markers)
    case 'CLEAR_MIDI_DATA':
      return  List()
    default:
      return state
  }
}

exports.guitarTracks = (state = List(), action) => {
  switch (action.type) {
    case 'UPDATE_MIDI_DATA':
      return  List(action.payload.guitarTracks)
    case 'CLEAR_MIDI_DATA':
      return  List()
    default:
      return state
  }
}

exports.tuningTracks = (state = List(), action) => {
  switch (action.type) {
    case 'UPDATE_MIDI_DATA':
      return  List(action.payload.tuningTracks)
   case 'CLEAR_MIDI_DATA':
      return  List()
     default:
      return state
  }
}

exports.patterns = (state = List(), action) => {
  switch (action.type) {
    case 'UPDATE_MIDI_DATA':
      return  List(action.payload.patterns)
    case 'CLEAR_MIDI_DATA':
      return  List()
    default:
      return state
  }
}
