import RNFetchBlob from "react-native-fetch-blob";
import { downloadProgress } from "./redux/actions";

// const android = RNFetchBlob.android;

let _dispatchProgress = () => {
  console.warn("_dispatchProgress is not hooked up in DownloadManager");
};

const dirs = RNFetchBlob.fs.dirs;

export const download = (url, mediaId) => {
  const path = `${dirs.MainBundleDir}/Media/song.m4a`;

  RNFetchBlob.config({
    path
    /* 
  NOTE: The addAndroidDownloads section below can be enabled to use Android's system-level downloader. If we do that, download progress shows up in the system notification area and a few others things happen. It's a lot more complicated though. For instance, we don't appear to get progress callbacks in the app, and the system is picky about where we can save the files. It might be good to implement some time in the future...
  */
    // addAndroidDownloads: {
    //   useDownloadManager: true, // <-- this is the only thing required
    //   // Optional, override notification setting (default to true)
    //   // notification: false,
    //   // Optional, but recommended since android DownloadManager will fail when
    //   // the url does not contains a file extension, by default the mime type will be text/plain
    //   // mime: "text/plain",
    //   title: "Song: 1979",
    //   description: "Song: 1979",
    //   path
    // }
    // fileCache: true
  })
    .fetch("GET", url, { "Transfer-Encoding": "Chunked" })
    .progress({ interval: 250 }, (received, total) => {
      _dispatchProgress({ [mediaId.toLowerCase()]: received / total });
    })
    .then(res => {
      // the temp file path
      // android.actionViewIntent(
      //   res.path(),
      //   "application/vnd.android.package-archive"
      // );
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
