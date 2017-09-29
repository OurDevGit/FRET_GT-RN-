import RNFetchBlob from "react-native-fetch-blob";
import { downloadProgress, finishDownload } from "./redux/actions";
import { setDownload } from "./models/Downloads";

// const android = RNFetchBlob.android;
const dirs = RNFetchBlob.fs.dirs;

let _dispatchProgress = () => {
  console.warn("_dispatchProgress is not hooked up in DownloadManager");
};

let _dispatchFinish = () => {
  console.warn("_dispatchFinish is not hooked up in DownloadManager");
};

const downloadFile = url => {
  const path = `${dirs.MainBundleDir}/Media/${Math.random()
    .toString()
    .slice(2)}`;

  return RNFetchBlob.config({
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
  }).fetch("GET", url, { "Transfer-Encoding": "Chunked" });
};

export const downloadSong = async (song, midi, mediaId) => {
  return new Promise((resolve, reject) => {
    let songTotal = 0;
    let midiTotal = 0;
    let songReceived = 0;
    let midiReceived = 0;
    let songPath = null;
    let midiPath = null;

    const sendProgress = () => {
      // console.debug({
      //   songReceived,
      //   midiReceived,
      //   songTotal,
      //   midiTotal
      // });
      _dispatchProgress({
        [mediaId.toLowerCase()]:
          (songReceived + midiReceived) / (songTotal + midiTotal)
      });
    };

    const finish = () => {
      if (midiPath !== null && songPath !== null) {
        console.debug(`done downloading ${mediaId}`);
        const files = {
          midiPath,
          songPath
        };
        resolve(files);
        _dispatchFinish({ [mediaId.toLowerCase()]: files });
      }
    };

    downloadFile(song)
      .progress({ interval: 250 }, (received, total) => {
        songReceived = received;
        songTotal = total;
        sendProgress();
      })
      .then(res => {
        console.debug("song done!");
        songPath = res.path();
        finish();
      });

    downloadFile(midi)
      .progress({ interval: 250 }, (received, total) => {
        midiReceived = received;
        midiTotal = total;
        sendProgress();
      })
      .then(res => {
        console.debug("midi done!");
        midiPath = res.path();
        if (songPath !== null) {
          resolve({
            midiPath,
            songPath
          });
          console.debug("all done!");
        }
      });
  });
};

export const configureDownloadManager = store => {
  _dispatchProgress = progressMap => {
    store.dispatch(downloadProgress(progressMap));
  };

  _dispatchFinish = fileMap => {
    store.dispatch(finishDownload(fileMap));
  };

  console.debug("DL manager is configured");
};
