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
  console.debug({ files });
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
  const iabMediaId = media.mediaID.toLowerCase();

  // First, see if we have downloaded media.
  // If so, play it!
  const downloadedMedia = yield getDownloadedMedia(mediaId);
  if (downloadedMedia !== undefined) {
    yield put(actions.setCurrentMedia(mediaId));
    return;
  }

  // put the media into indeterminate mode since the rest is async (the UI will show a spinner in the mean time)
  yield put({
    type: "SET_DOWNLOAD_PROGRESS",
    payload: {
      [iabMediaId]: -1
    }
  });

  // const state = yield select(state => state);
  // console.debug(state.toJS());

  const transactionDetails = yield getTransactionDetails(iabMediaId);
  console.debug({ transactionDetails });

  switch (media.getMode) {
    case GetMediaButtonMode.Purchase:
      const purchaseSuccess = yield doPurchase(media);
      if (purchaseSuccess === true) {
        yield put(actions.addPurchasedMedia(mediaId));
        console.debug(`added purchased ${mediaId}`);
      } else {
        // remove the indeterminate spinner state
        yield put({
          type: "SET_DOWNLOAD_PROGRESS",
          payload: {
            [iabMediaId]: undefined
          }
        });
      }

      break;
    case GetMediaButtonMode.Download:
      console.debug("do download!");
      const songFiles = yield downloadMedia(media);
      console.debug({ songFiles });
      const success = yield setDownload(mediaId, songFiles);
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
