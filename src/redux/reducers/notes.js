import Immutable from 'immutable'

const notes = (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_MIDI_FILE':
      return  action.payload.notes
    default:
      return state
  }
}

export default time