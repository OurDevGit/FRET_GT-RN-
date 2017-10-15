import { call, put, takeEvery, takeLatest, select } from "redux-saga/effects";
import * as Api from "./api";
import {
  getTransactionDetails,
  doPurchase,
  downloadMedia
} from "./sagas-media";
import { GetMediaButtonMode } from "./models/Media";
import { setDownload } from "./models/Downloads";
import { getProductDetails } from "./models/Products";
import * as actions from "./redux/actions";
import { getDownloadedMediaFiles } from "./redux/selectors";
import { setStore } from "./models/Store";

function* getDownloadedMedia(mediaId) {
  const files = yield select(getDownloadedMediaFiles, mediaId);
  // console.debug({ files });
  return files;
}

const getDownloadProgress = mediaId =>
  select(state => state.get("downloadedMedia")).get(mediaId);

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
  const media = action.payload;
  const mediaId = media.mediaID;
  console.debug(`chose media: ${mediaId}`);

  // First, see if we have downloaded media.
  // If so, play it!
  const downloadedMedia = yield getDownloadedMedia(mediaId);
  if (downloadedMedia !== undefined) {
    console.debug("we have this media, so we're going to play it now");
    yield put(actions.setCurrentMedia(mediaId));
    return;
  }

  console.debug("we don't have that media...");

  // put the media into indeterminate mode since the rest is async (the UI will show a spinner in the mean time)
  yield put(actions.downloadProgress(mediaId, -1));

  // const state = yield select(state => state);
  // console.debug(state.toJS());

  console.debug("going to ask Google IAB if we've bought that media");
  const transactionDetails = yield getTransactionDetails(mediaId);
  console.debug({ transactionDetails });

  if (transactionDetails.purchaseState === "PurchasedSuccessfully") {
    console.debug("We own this. Downloading the media now.");
    const mediaFiles = yield downloadMedia(media);
    // console.debug({ mediaFiles });
    const success = yield setDownload(mediaId, mediaFiles);
    yield put(actions.finishDownload(mediaId, mediaFiles));
    return;
  }

  console.debug("going into getMode switch");

  switch (media.getMode) {
    case GetMediaButtonMode.Purchase:
      const purchaseSuccess = yield doPurchase(media);
      if (purchaseSuccess === true) {
        yield put(actions.addPurchasedMedia(mediaId));
        console.debug(`added purchased ${mediaId}`);
      } else {
        // remove the indeterminate spinner state
        yield put(actions.downloadProgress(mediaId, undefined));
      }

      break;
    case GetMediaButtonMode.Download:
      console.debug("do download!");
      const mediaFiles = yield downloadMedia(media);
      console.debug({ mediaFiles });
      const success = yield setDownload(mediaId, mediaFiles);
      yield put(actions.finishDownload(mediaId, mediaFiles));
      // console.debug(downloadedMedia.toJS());
      break;
    case GetMediaButtonMode.Downloading:
      break;
    case GetMediaButtonMode.ComingSoon:
      break;
    case GetMediaButtonMode.Indetermindate:
      break;
    case GetMediaButtonMode.Play:
      break;
    default:
      break;
  }
}

function* watchRereshStore(action) {
  try {
    // get store from backend
    const storeRaw = yield Api.fetchStore();
    const storeDb = yield setStore(storeRaw);
    yield put(actions.storeLoaded(storeDb));
    console.debug("got store from backend");

    // get store details from Google In-App Billing
    const mediaIds = Object.keys(storeDb.mediaById);
    const productDetails = yield getProductDetails(mediaIds);
    yield put(actions.productDetailsLoaded(productDetails));
  } catch (error) {
    console.debug(error);
    console.debug(error.stack);
  }
  // this.props.storeLoaded(storeObjects); // dispatch
}

function* mySaga() {
  yield takeLatest("AD_FETCH_REQUESTED", fetchAd);
  yield takeEvery("CHOOSE_MEDIA", watchChooseMedia);
  yield takeLatest("REFRESH_STORE", watchRereshStore);
}

export default mySaga;
