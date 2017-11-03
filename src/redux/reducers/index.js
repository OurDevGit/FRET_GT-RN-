import { combineReducers } from "redux-immutable";
import ad from "./ad";
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
  listedMedia,
  mediaByListId,
  storeSorting,
  getList as getMediaList
} from "./store";
import { productDetails, productDetailsHaveLoaded } from "./products";
import { purchasedMedia } from "./purchases";
import { downloadedMedia } from "./downloads";
import { currentMedia } from "./current_media";
import { favorites } from "./favorites";
import {
  countdownTimerState,
  leftHandState,
  autoPartSwitchingState,
  currentNotation
} from "./settings";
import { guitars } from "./guitar";

const appReducer = combineReducers({
  ad,
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
  listedMedia,
  mediaByListId,
  storeSorting,
  // In-App Billing
  productDetails,
  productDetailsHaveLoaded,
  purchasedMedia,
  // Downloads
  downloadedMedia,
  // Current Media
  currentMedia,
  favorites,
  // Guitars
  guitars,
  // Settings
  countdownTimerState,
  leftHandState,
  autoPartSwitchingState,
  currentNotation
});

export default appReducer;

export const getList = (state, listId) =>
  getMediaList(state.mediaByListId, listId);
