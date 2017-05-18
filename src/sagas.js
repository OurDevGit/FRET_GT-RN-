import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import * as Api from "./api";

function* fetchAd(action) {
  // console.log(`fetchAd!`)

  try {
    const ad = yield call(Api.fetchAd);
    // console.log('got ad')
    // console.log(ad)
    yield put({ type: "AD_FETCH_SUCCEEDED", payload: ad });
  } catch (e) {
    console.log(`error fetching ad`);
    console.log(e);
    yield put({ type: "AD_FETCH_FAILED", payload: e.message });
  }
}

function* mySaga() {
  yield takeEvery("AD_FETCH_REQUESTED", fetchAd);
}

export default mySaga;
