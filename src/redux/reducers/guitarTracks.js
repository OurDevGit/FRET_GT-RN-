import { List } from 'immutable'

const guitarTracks = (state = [], action) => {
  switch (action.type) {
    case 'UPDATE_MIDI_DATA':
      return  action.payload.guitarTracks
    default:
      return state
  }
}

export default guitarTracks