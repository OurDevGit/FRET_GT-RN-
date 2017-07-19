import {
  combineReducers
} from 'redux-immutable';
import ad from './ad'
import time from './time'
import { markers, guitarTracks, tuningTracks, patterns } from './midi'

const appReducer = combineReducers({
  ad,
  time,
  markers,
  guitarTracks,
  tuningTracks,
  patterns
})

export default appReducer