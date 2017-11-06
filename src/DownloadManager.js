import RNFetchBlob from "react-native-fetch-blob";
import { finishDownload, setDownloads } from "./redux/actions";
import { setDownload, getAllDownloads } from "./models/Downloads";
import { guid } from "./utils";
import { throttle } from "lodash";

// const android = RNFetchBlob.android;
const dirs = RNFetchBlob.fs.dirs;

let _dispatchFinish = () => {
  console.warn("_dispatchFinish is not hooked up in DownloadManager");
};

// download 1 file
const downloadFile = url => {
  const randFilename = guid();
  const path = `${dirs.MainBundleDir}/Media/${randFilename}`;

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

const urlToPath = url => {
  const path = url
    .split("/")
    .slice(3)
    .join("/")
    .split("?")[0];

  const unescapedPath = unescape(unescape(path));

  return unescapedPath;
};

// download multiple files
const downloadFiles = (urls, progressCallback) => {
  let progressMap = {};
  let filesMap = {};

  const makeProgress = () => {
    const progresses = Object.values(progressMap);
    // console.debug(progresses);
    const tally = progresses.reduce(
      (prev, curr) => {
        return {
          received: prev.received + curr.received,
          total: prev.total + curr.total
        };
      },
      { received: 0, total: 0 }
    );
    // console.debug(tally);
    const progress = tally.received / tally.total;
    // console.debug(progress);
    return progress;
  };

  const filePromises = urls.map(url =>
    downloadFile(url)
      .progress({ interval: 250 }, (received, total) => {
        progressMap[url] = {
          received: Number(received),
          total: Number(total)
        };
        progressCallback(makeProgress());
      })
      .then(res => {
        const dlPath = res.path();
        filesMap[urlToPath(url)] = dlPath;
      })
  );

  const allProms = Promise.all(filePromises);
  return allProms.then(() => {
    return filesMap;
  });
};

export const downloadMediaFiles = async (files, mediaId) => {
  // set progress to -1 to indicate Indeterminate mode
  throttledUpdate(mediaId, -1);

  const filesMap = await downloadFiles(files.map(f => f.url), progress => {
    throttledUpdate(mediaId, progress);
  });

  // finish download
  console.debug("done with download");
  updateSubscribers(mediaId, 1);
  _dispatchFinish();

  // console.debug(filesMap);
  return filesMap;
};

export const configureDownloadManager = async store => {
  _dispatchFinish = fileMap => {
    console.debug("finishing DL");
    store.dispatch(finishDownload(fileMap));
  };

  const allDownloads = await getAllDownloads();
  store.dispatch(setDownloads(allDownloads));

  // console.debug("DL manager is configured");
};

/*
 * Subscription mechanism
 * Instead of going through state and props, we update download UI directly.
 * This avoids a lot of re-renders
 */

var _subscribers = [];

const updateSubscribers = (mediaId, progress) => {
  _subscribers.forEach(callback => {
    callback(mediaId, progress);
  });
};

const throttledUpdate = throttle(updateSubscribers, 250, {
  leading: true,
  trailing: false
});

export const subscribe = callback => {
  _subscribers.push(callback);
};

export const remove = callback => {
  _subscribers = _subscribers.filter(cb => cb !== callback);
};
