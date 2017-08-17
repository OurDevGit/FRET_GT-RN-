import { combineReducers } from "redux-immutable";
import ad from "./ad";
import time from "./time";
import {
  markers,
  guitarTracks,
  visibleTracks,
  tuningTracks,
  patterns
} from "./midi";
import { currentLoop, loopIsEnabled } from "./loop";

const appReducer = combineReducers({
  ad,
  time,
  markers,
  guitarTracks,
  visibleTracks,
  tuningTracks,
  patterns,
  currentLoop,
  loopIsEnabled
});

export default appReducer;
