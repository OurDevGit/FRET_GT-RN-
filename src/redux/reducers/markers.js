import { List } from 'immutable'

const markers = (state = [], action) => {
  switch (action.type) {
    case 'UPDATE_MIDI_DATA':
      console.log("MARKERS: ", action.payload.markers)
      return  action.payload.markers
    default:
      return state
  }
}

export default markers