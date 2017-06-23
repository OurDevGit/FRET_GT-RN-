import {
  combineReducers
} from 'redux-immutable';
import ad from './ad'
import time from './time'
import markers from './markers'
import guitarTracks from './guitarTracks'

const appReducer = combineReducers({
  ad,
  time,
  markers,
  guitarTracks
})

export default appReducer