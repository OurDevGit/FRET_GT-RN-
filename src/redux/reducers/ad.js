import Immutable from 'immutable'

const ad = (state = {}, action) => {
  switch (action.type) {
    case 'AD_FETCH_SUCCEEDED':
      return  Immutable.fromJS(action.payload)
    // case 'AD_FETCH_FAILED':
    //   return Immutable.fromJS(action.payload)
    default:
      return state
  }
}

export default ad
