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
  storeSorting,
  getList as getMediaList
} from "./store";
import { productDetails, productDetailsHaveLoaded } from "./products";
import { purchasedMedia } from "./purchases";
import { downloadProgress } from "./downloads";

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
  // Store
  categories,
  subCategoriesByCategoryId,
  groupsBySubCategoryId,
  mediaById,
  mediaByListId,
  storeSorting,
  // In-App Billing
  productDetails,
  productDetailsHaveLoaded,
  purchasedMedia,
  // Downloads
  downloadProgress
});

export default appReducer;

export const getList = (state, listId) =>
  getMediaList(state.mediaByListId, listId);
