import { combineReducers } from "redux-immutable";
import ad from "./ad";
import time from "./time";
import {
  markers,
  guitarTracks,
  visibleTracks,
  tuningTracks,
  patterns,
  smartTrack
} from "./midi";
import { currentLoop, loopIsEnabled } from "./loop";
import { videoChapters, videoMarkers } from "./lesson";

const appReducer = combineReducers({
  ad,
  time,
  markers,
  videoChapters,
  videoMarkers,
  guitarTracks,
  visibleTracks,
  tuningTracks,
  patterns,
  smartTrack,
  currentLoop,
  loopIsEnabled
});

export default appReducer;
