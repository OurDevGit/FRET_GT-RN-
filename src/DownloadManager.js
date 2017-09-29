import RNFetchBlob from "react-native-fetch-blob";
import { downloadProgress } from "./redux/actions";

let _dispatchProgress = () => {
  console.warn("_dispatchProgress is not hooked up in DownloadManager");
};

const dirs = RNFetchBlob.fs.dirs;

export const download = (url, mediaId) => {
  RNFetchBlob.config({
    path: `${dirs.DCIMDir}/GuitarTunes/song.mp3`
    // fileCache: true
  })
    .fetch("GET", url)
    .progress({ interval: 250 }, (received, total) => {
      _dispatchProgress({ [mediaId.toLowerCase()]: received / total });
    })
    .then(res => {
      // the temp file path
      console.debug("The file saved to ", res.path());
    })
    .catch(err => {
      console.error(err);
    });
};

export const configureDownloadManager = store => {
  _dispatchProgress = progressMap => {
    store.dispatch(downloadProgress(progressMap));
  };

  console.debug("DL manager is configured");
};
