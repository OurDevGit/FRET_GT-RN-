import {
  combineReducers
} from 'redux-immutable';
import ad from './ad'
import { markers, guitarTracks, tuningTracks, patterns } from './midi'

const appReducer = combineReducers({
  ad,
  markers,
  guitarTracks,
  tuningTracks,
  patterns
})

export default appReducer