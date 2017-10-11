import { call, put, takeEvery, takeLatest, select } from "redux-saga/effects";
import * as Api from "./api";
import {
  getTransactionDetails,
  doPurchase,
  downloadMedia
} from "./sagas-media";
import { GetMediaButtonMode } from "./models/Media";
import { setDownload } from "./models/Downloads";
import * as actions from "./redux/actions";

function* getDownloadedMedia(mediaId) {
  const dlMedia = yield select(state => state.get("downloadedMedia"));
  // console.debug(`downloaded media:`);
  // console.debug(dlMedia.toJS());
  return dlMedia.get(mediaId);
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
    console.debug("PLAY!");
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

function* mySaga() {
  yield takeEvery("AD_FETCH_REQUESTED", fetchAd);
  yield takeEvery("CHOOSE_MEDIA", watchChooseMedia);
}

export default mySaga;
