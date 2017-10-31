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
import { setPurchased } from "./models/Purchases";
import { setDownload, removeDownload } from "./models/Downloads";
import { fetchProductDetails, fetchPurchases } from "./models/Products";
import * as actions from "./redux/actions";
import { getMediaById, getDownloadedMediaFiles } from "./redux/selectors";
import { setStore, setProductDetails } from "./models/Store";
import { doFreeMedia } from "./Config";

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

function* fetchAd(action) {
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

function* watchChooseMedia(action) {
  const mediaId = action.payload;
  const media = yield getMedia(mediaId);
  console.debug(`chose media: ${mediaId}`);
  console.debug(media);

  // First, see if we have downloaded media.
  // If so, play it!
  const downloadedMedia = yield getDownloadedMedia(mediaId);
  if (downloadedMedia !== undefined) {
    console.debug("we have this media, so we're going to play it now");
    yield put(actions.setCurrentMedia(mediaId));
    return;
  }

  console.debug("we don't have that media...");

  // const state = yield select(state => state);
  // console.debug(state.toJS());

  console.debug("going to ask Google IAB if we've bought that media");
  var transactionDetails = { purchaseState: "PurchasedSuccessfully" };
  if (doFreeMedia !== true) {
    transactionDetails = yield fetchTransactionDetails(mediaId);
  }

  // if we already bought this, then download it and finish
  if (
    transactionDetails !== null &&
    transactionDetails.purchaseState === "PurchasedSuccessfully"
  ) {
    console.debug("We own this. Downloading the media now.");
    const mediaFiles = yield downloadMedia(media);
    // console.debug({ mediaFiles });
    yield setDownload(mediaId, mediaFiles);
    yield put(actions.finishDownload(mediaId, mediaFiles));
    return;
  }

  console.debug("going into getMode switch");
  console.debug(media.getMode);

  switch (media.getMode) {
    case GetMediaButtonMode.Purchase: {
      const purchaseSuccess = yield doPurchase(media);
      if (purchaseSuccess === true) {
        yield put(actions.addPurchasedMedia(mediaId));
        console.debug(`added purchased ${mediaId}`);
      }

      break;
    }
    case GetMediaButtonMode.Download: {
      console.debug("do download!");
      const mediaFiles = yield downloadMedia(media);
      console.debug({ mediaFiles });
      const success = yield setDownload(mediaId, mediaFiles);
      yield put(actions.finishDownload(mediaId, mediaFiles));
      // console.debug(downloadedMedia.toJS());
      break;
    }
    case GetMediaButtonMode.Downloading:
      break;
    case GetMediaButtonMode.ComingSoon:
      break;
    case GetMediaButtonMode.Indetermindate:
      break;
    case GetMediaButtonMode.Play:
      break;
    default: {
      const purchaseSuccess = yield doPurchase(media);
      if (purchaseSuccess === true) {
        yield put(actions.addPurchasedMedia(mediaId));
        console.debug(`added purchased ${mediaId}`);
      }
    }
  }
}

function* watchRefreshStore(action) {
  try {
    // get store from backend
    const storeRaw = yield Api.fetchStore();
    const storeDb = yield setStore(storeRaw);
    yield put(actions.storeLoaded(storeDb));

    // get store details from Google In-App Billing
    if (doFreeMedia !== true) {
      const mediaIds = Object.keys(storeDb.mediaById);
      const productDetails = yield fetchProductDetails(mediaIds);
      yield setProductDetails(productDetails);
      yield put(actions.productDetailsLoaded(productDetails));

      // load which products we own from Google
      const purchasedMedia = yield fetchPurchases();
      yield setPurchased(purchasedMedia);
      yield put(actions.setPurchasedMedia(purchasedMedia));
    }

    // load favorites
    const faves = yield getFaves();
    yield put(actions.setFavorites(faves));
  } catch (error) {
    console.debug(error);
    console.debug(error.stack);
  }
  // this.props.storeLoaded(storeObjects); // dispatch
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

function* watchToggleFavorite(action) {
  const mediaId = action.payload;
  const isFavorite = yield getFavorite(mediaId);

  if (isFavorite === true) {
    addFave(mediaId);
  } else {
    deleteFave(mediaId);
  }
}

function* mySaga() {
  yield takeLatest("AD_FETCH_REQUESTED", fetchAd);
  yield takeEvery("CHOOSE_MEDIA", watchChooseMedia);
  yield takeLatest("REFRESH_STORE", watchRefreshStore);
  yield takeEvery("DELETE_MEDIA", watchDeleteMedia);
  yield takeEvery("TOGGLE_FAVORITE", watchToggleFavorite);
}

export default mySaga;
