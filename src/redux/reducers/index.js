import { combineReducers } from "redux-immutable";
import ad from "./ad";
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
  markers,
  guitarTracks,
  visibleTracks,
  tuningTracks,
  patterns,
  currentLoop,
  loopIsEnabled
});

export default appReducer;
