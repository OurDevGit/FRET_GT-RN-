import {
  combineReducers
} from 'redux-immutable';
import ad from './ad'

const appReducer = combineReducers({
  ad
})

export default appReducer