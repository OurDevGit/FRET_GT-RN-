import { combineReducers } from "redux-immutable";
import ad from "./ad";
import {
  markers,
  guitarTracks,
  visibleTracks,
  tuningTracks,
  jamBarTrack,
  isShowingJamBar,
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
  currentNotation,
  tuningMode
} from "./settings";
import { guitars } from "./guitar";
import { intermediateMedia } from "./media";
import { modalIsPresented, appIsClosing } from "./app";

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
  jamBarTrack,
  isShowingJamBar,
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
  // Media
  intermediateMedia,
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
  currentNotation,
  tuningMode,
  // App
  modalIsPresented,
  appIsClosing
});

export default appReducer;

export const getList = (state, listId) =>
  getMediaList(state.mediaByListId, listId);
