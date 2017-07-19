import Immutable from 'immutable'

const time = (state = 0, action) => {
  switch (action.type) {
    case 'UPDATE_TIME':
      return  action.payload
    default:
      return state
  }
}

export default time