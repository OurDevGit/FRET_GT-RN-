import { combineReducers } from "redux-immutable";
import ad from "./ad";
import { time, timeMidiOffset } from "./time";
import {
  markers,
  guitarTracks,
  visibleTracks,
  tuningTracks,
  patterns,
  smartTrack
} from "./midi";
import { currentLoop, loopIsEnabled } from "./loop";
import {
  videoChapters,
  videoMarkers,
  videoMidiFiles,
  currentVideoChapter,
  currentVideoMarker,
  currentVideoMidiFile
} from "./lesson";
import {
  categories,
  subCategoriesByCategoryId,
  groupsBySubCategoryId,
  mediaById,
  mediaByListId,
  storeSorting
} from "./store";

const appReducer = combineReducers({
  ad,
  time,
  timeMidiOffset,
  markers,
  videoChapters,
  videoMarkers,
  videoMidiFiles,
  currentVideoChapter,
  currentVideoMarker,
  currentVideoMidiFile,
  guitarTracks,
  visibleTracks,
  tuningTracks,
  patterns,
  smartTrack,
  currentLoop,
  loopIsEnabled,
  categories,
  subCategoriesByCategoryId,
  groupsBySubCategoryId,
  mediaById,
  mediaByListId,
  storeSorting
});

export default appReducer;
