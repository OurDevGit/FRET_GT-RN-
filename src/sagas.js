import { call, put, takeEvery, takeLatest, select } from "redux-saga/effects";
import * as Api from "./api";
import { getTransactionDetails } from "./sagas-media";
import { GetMediaButtonMode } from "./models/Media";

const getState = state => state;

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
  const iabMediaId = media.mediaID.toLowerCase();
  console.debug(`watchChooseMedia: ${iabMediaId}`);
  console.debug(media.getMode);

  // put the media into indeterminate mode since the rest is async (the UI will show a spinner in the mean time)
  yield put({
    type: "SET_DOWNLOAD_PROGRESS",
    payload: {
      [iabMediaId]: -1
    }
  });

  const state = yield select(getState);
  console.debug(state.toJS());

  const transactionDetails = yield getTransactionDetails(iabMediaId);
  console.debug({ transactionDetails });

  // switch (media.getMode) {
  //   case GetMediaButtonMode.Purchase:
  //     yield doPurchase(media);
  //     break;
  //   case GetMediaButtonMode.Download:
  //     yield downloadMedia(media);
  //     break;
  //   case GetMediaButtonMode.Downloading:
  //     break;
  //   case GetMediaButtonMode.ComingSoon:
  //     break;
  //   case GetMediaButtonMode.Indetermindate:
  //     break;
  //   case GetMediaButtonMode.Play:
  //     break;
  //   default:
  //     break;
  // }
}

function* mySaga() {
  yield takeEvery("AD_FETCH_REQUESTED", fetchAd);
  yield takeEvery("CHOOSE_MEDIA", watchChooseMedia);
}

export default mySaga;
