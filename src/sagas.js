import { call, put, takeEvery, takeLatest, select } from "redux-saga/effects";
import * as Api from "./api";
import RNFetchBlob from "react-native-fetch-blob";
const fs = RNFetchBlob.fs;
import {
  fetchTransactionDetails,
  doPurchase,
  downloadMedia
} from "./sagas-media";
import {
  GetMediaButtonMode,
  getFaves,
  addFave,
  deleteFave
} from "./models/Media";
import { setPurchased, loadPurchased } from "./models/Purchases";
import { setDownload, removeDownload } from "./models/Downloads";
import { fetchProductDetails, fetchPurchases } from "./models/Products";
import {
  setStore,
  setProductDetails,
  getStore,
  getProductDetails
} from "./models/Store";
import {
  getAutoPartSwitchingState,
  getCountdownTimerState,
  getCurrentNotation,
  getLeftHandState,
  getTuningMode
} from "./models/Settings";
import * as actions from "./redux/actions";
import { getMediaById, getDownloadedMediaFiles } from "./redux/selectors";
import {
  setCountdownTimerState,
  setLeftHandState,
  setAutoPartSwitchingState,
  setCurrentNotation,
  setTuningMode
} from "./models/Settings";
import { trackFavorite, trackPurchase } from "./metrics";

const dirs = RNFetchBlob.fs.dirs;

function* getMedia(mediaId) {
  const mediaImm = yield select(getMediaById, mediaId);
  if (mediaImm !== undefined) {
    return mediaImm.toJS();
  } else {
    return {};
  }
}

function* getDownloadedMedia(mediaId) {
  const files = yield select(getDownloadedMediaFiles, mediaId);
  // console.debug({ files });
  return files;
}

const getFavorite = mediaId =>
  select(state => state.get("favorites").includes(mediaId));

function* fetchAd() {
  // console.log(`fetchAd!`)

  try {
    const ad = yield call(Api.fetchAd);
    // console.log("got ad");
    // console.log(ad);
    yield put({ type: "AD_FETCH_SUCCEEDED", payload: ad });
  } catch (e) {
    console.log(`error fetching ad`);
    console.log(e);
    yield put({ type: "AD_FETCH_FAILED", payload: e.message });
  }
}

function* fetchConfig() {
  // console.log(`fetchConfig!`);

  try {
    const config = yield call(Api.fetchConfig);
    // console.log("got config");
    // console.log(config);
    yield put({ type: "CONFIG_FETCH_SUCCEEDED", payload: config });
  } catch (e) {
    // console.log(`error fetching config`);
    // console.log(e);
    yield put({ type: "CONFIG_FETCH_FAILED", payload: e.message });
  }
}

function* doDownload(media, mediaId, transactionDetails) {
  try {
    const mediaFiles = yield downloadMedia(media, transactionDetails);
    // console.debug({ mediaFiles });
    yield setDownload(mediaId, mediaFiles);
    yield put(actions.finishDownload(mediaId, mediaFiles));
  } catch (err) {
    // console.debug("error downloading media");
    // console.error(err);
    yield put(actions.deleteMedia(mediaId));
  }
}

// When the user taps on a Media Item in the media list:
// 1. Play it if they have it
// 2. Download it if they own it
// 3. Buy it if they don't own it, then download it
// (skip all this if the media is currently downloading or in an intermediate state)

function* watchChooseMedia(action) {
  const mediaId = action.payload;
  const media = yield getMedia(mediaId);
  console.debug(`chose media: ${mediaId}`);
  // console.debug(media);

  yield put(actions.setIntermediate(mediaId, true));

  // 1. Play the media if they have it
  const downloadedMedia = yield getDownloadedMedia(mediaId);
  if (downloadedMedia !== undefined) {
    console.debug("we have this media, so we're going to play it now");
    yield put(actions.setCurrentMedia(mediaId));

    return;
  }

  console.debug("we don't have that media...");

  // 2. Download it if we own it.

  var transactionDetails =
    media.isFree === true
      ? { purchaseState: "PurchasedSuccessfully", isFree: true }
      : yield fetchTransactionDetails(mediaId);

  // console.debug({ transactionDetails });

  // if we already bought this, then download it and finish
  if (
    transactionDetails !== null &&
    transactionDetails.purchaseState === "PurchasedSuccessfully"
  ) {
    console.debug("We own this. Downloading the media now.");

    yield doDownload(media, mediaId, transactionDetails);

    return;
  } else {
    console.debug("we have not bought it.");
  }

  console.debug({ media });

  // 3. Buy the media
  const purchaseResult = yield doPurchase(media);

  console.debug({ purchaseResult });

  if (purchaseResult.success === true) {
    yield put(actions.addPurchasedMedia(mediaId));
    yield doDownload(media, mediaId, purchaseResult.transactionDetails);
    console.debug(`added purchased ${mediaId}`);

    // track the purchase in MixPanel
    const productDetails = yield getProductDetails();
    const details = productDetails[mediaId.toLowerCase()];
    trackPurchase(mediaId, media.title, details.priceValue, details.currency);
  }

  console.debug("going into getMode switch");
  console.debug(`getMode: ${media.getMode}`);

  switch (media.getMode) {
    case GetMediaButtonMode.Purchase:
      break;
    case GetMediaButtonMode.Downloading:
      break;
    case GetMediaButtonMode.ComingSoon:
      break;
    case GetMediaButtonMode.Indeterminate:
      break;
    case GetMediaButtonMode.Play:
      break;
    default: {
      const purchaseResult = yield doPurchase(media);
      if (purchaseResult.success === true) {
        console.debug("did purchase");
        yield put(actions.addPurchasedMedia(mediaId));
        console.debug(`added purchased ${mediaId}`);
        yield doDownload(media, mediaId, purchaseResult.transactionDetails);
      } else {
        console.debug("did NOT purchase");
      }
    }
  }

  yield put(actions.setIntermediate(mediaId, false));
}

function* watchRefreshStore(action) {
  // console.debug("refeshStore saga!");
  // load favorites
  const faves = yield getFaves();
  yield put(actions.setFavorites(faves));

  try {
    // get store from backend
    const storeRaw = yield Api.fetchStore();
    // console.debug(JSON.stringify(storeRaw, null, 2));
    const storeDb = yield setStore(storeRaw);
    yield put(actions.storeLoaded(storeDb));

    // get store details from Google In-App Billing
    const mediaIds = Object.keys(storeDb.mediaById);

    // console.debug("asking IAB for details");
    // console.debug(mediaIds);

    const productDetails = yield fetchProductDetails(mediaIds);
    yield setProductDetails(productDetails);
    yield put(actions.productDetailsLoaded(productDetails));

    // load which products we own from Google
    const purchasedMedia = yield fetchPurchases();
    yield setPurchased(purchasedMedia);
    yield put(actions.setPurchasedMedia(purchasedMedia));
  } catch (error) {
    console.debug(error);
    console.debug(error.stack);
  }
}

function* watchDeleteMedia(action) {
  const mediaId = action.payload;
  const downloads = yield getDownloadedMedia(mediaId);

  // send and action to remove this media from state
  yield put(actions.removeDownload(mediaId));

  // delete each file
  if (downloads !== undefined) {
    const vals = downloads.values();

    for (let filePath of vals) {
      fs.unlink(filePath);
    }
  }

  // remove the record from the Downloads Store
  removeDownload(mediaId);
}

function watchDeleteAllMedia() {
  const dir = `${dirs.MainBundleDir}/Media`;
  fs.unlink(dir);
}

function* watchBootstrap() {
  // Settings
  const autoPartSwitching = yield getAutoPartSwitchingState();
  const countdownTimer = yield getCountdownTimerState();
  const currentNotation = yield getCurrentNotation();
  const leftHanded = yield getLeftHandState();
  const tuningMode = yield getTuningMode();

  // Store
  const storeObjects = yield getStore();
  const productDetails = yield getProductDetails();
  const purchasedMedia = yield loadPurchased();

  const bootStrapState = {
    autoPartSwitching,
    countdownTimer,
    currentNotation,
    leftHanded,
    tuningMode,
    storeObjects,
    productDetails,
    purchasedMedia
  };

  yield put(actions.setBootstrap(bootStrapState));
}

function* watchToggleFavorite(action) {
  const mediaId = action.payload;
  const isFavorite = yield getFavorite(mediaId);

  if (isFavorite === true) {
    addFave(mediaId);
  } else {
    deleteFave(mediaId);
  }

  trackFavorite(mediaId, isFavorite);
}

// SETTINGS

function* watchSetCountdownTimerState(action) {
  yield setCountdownTimerState(action.payload);
}

function* watchSetLeftHandState(action) {
  yield setLeftHandState(action.payload);
}

function* watchSetAutoPartSwitching(action) {
  yield setAutoPartSwitchingState(action.payload);
}

function* watchCurrentNotation(action) {
  yield setCurrentNotation(action.payload);
}

function* watchSetTuningMode(action) {
  yield setTuningMode(action.payload);
}

function* mySaga() {
  yield takeLatest("AD_FETCH_REQUESTED", fetchAd);
  yield takeLatest("CONFIG_FETCH_REQUESTED", fetchConfig);
  yield takeEvery("CHOOSE_MEDIA", watchChooseMedia);
  yield takeLatest("REFRESH_STORE", watchRefreshStore);
  yield takeEvery("DELETE_MEDIA", watchDeleteMedia);
  yield takeEvery("TOGGLE_FAVORITE", watchToggleFavorite);
  yield takeEvery("SET_COUNTDOWN_TIMER_STATE", watchSetCountdownTimerState);
  yield takeEvery("SET_LEFT_HAND_STATE", watchSetLeftHandState);
  yield takeEvery("SET_TUNING_MODE", watchSetTuningMode);
  yield takeEvery("SET_AUTO_PART_SWITCHING_STATE", watchSetAutoPartSwitching);
  yield takeEvery("SET_CURRENT_NOTATION", watchCurrentNotation);
  yield takeLatest("DELETE_ALL_MEDIA", watchDeleteAllMedia);
  yield takeLatest("REQUEST_BOOTSTRAP", watchBootstrap);
}

export default mySaga;
