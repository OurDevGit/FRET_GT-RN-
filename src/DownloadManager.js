import RNFetchBlob from "react-native-fetch-blob";
import { finishDownload, setDownloads, deleteMedia } from "./redux/actions";
import { setDownload, getAllDownloads } from "./models/Downloads";
import { guid } from "./utils";
import { throttle } from "lodash";

// const android = RNFetchBlob.android;
const dirs = RNFetchBlob.fs.dirs;

let _dispatchFinish = () => {
  console.warn("_dispatchFinish is not hooked up in DownloadManager");
};

const isEncryptedFileType = url => {
  const parts = url.split(".");
  const isMp4 = parts[parts.length - 1].toLowerCase().indexOf("mp4") === 0;
  const isM4a = parts[parts.length - 1].toLowerCase().indexOf("m4a") === 0;

  return isMp4 || isM4a;
};

// download 1 file
const downloadFile = (
  url,
  dir = "MISC_FILES",
  doRandomName = true,
  filePath
) => {
  const filename = doRandomName === true ? guid() : filePath;
  const path = `${dirs.MainBundleDir}/${dir}/${filename}`;

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
export const downloadFiles = (urls, dir, doRandomNames, progressCallback) => {
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

  const filePromises = urls.map(url => {
    const urlPath = urlToPath(url);
    return downloadFile(url, dir, doRandomNames, urlPath)
      .progress({ interval: 250 }, (received, total) => {
        progressMap[url] = {
          received: Number(received),
          total: Number(total)
        };
        if (progressCallback !== undefined) {
          progressCallback(makeProgress());
        }
      })
      .then(res => {
        const dlPath = res.path();

        return RNFetchBlob.fs.stat(dlPath).then(stats => {
          const headerSize = Number(res.respInfo.headers["Content-Length"]);
          const paddedSize = isEncryptedFileType(url)
            ? headerSize + 17
            : headerSize;
          if (stats.size === paddedSize) {
            return { dlPath };
          } else {
            throw new Error("incomplete download");
            return false;
          }
        });
      })
      .then(({ dlPath }) => {
        if (dlPath) {
          filesMap[urlPath] = dlPath;
        } else {
          console.debug("no dl Path");
        }
      });
  });

  const allProms = Promise.all(filePromises);
  return allProms.then(() => {
    return filesMap;
  });
};

export const downloadMediaFiles = async (files, mediaId) => {
  // set progress to -1 to indicate Indeterminate mode
  throttledUpdate(mediaId, -1);

  try {
    const filesMap = await downloadFiles(
      files.map(f => f.url),
      "Media",
      true,
      progress => {
        throttledUpdate(mediaId, progress);
      }
    );

    // finish download
    console.debug("done with downloads");
    console.debug({ filesMap });
    throttledUpdate(mediaId, 1);
    _dispatchFinish();

    // console.debug(filesMap);
    return filesMap;
  } catch (err) {
    throttledUpdate(mediaId, 1);
    throw err;
  }
};

export const configureDownloadManager = async store => {
  _dispatchFinish = fileMap => {
    console.debug("finishing DL");
    store.dispatch(finishDownload(fileMap));
  };

  const allDownloads = await getAllDownloads();
  store.dispatch(setDownloads(allDownloads));

  pruneDownloads(store, allDownloads);

  // console.debug("DL manager is configured");
};

const pruneDownloads = (store, allDownloads) => {
  const reverseMap = {};

  // make a map from file to mediaId
  Object.keys(allDownloads).forEach(mediaId => {
    Object.values(allDownloads[mediaId]).forEach(file => {
      reverseMap[file] = mediaId;
    });
  });

  const knownFiles = Object.keys(reverseMap);

  // if any file doesn't exist, delete that media
  knownFiles.forEach(file => {
    RNFetchBlob.fs.exists(file).then(doesExist => {
      if (doesExist === false) {
        const mediaId = reverseMap[file];
        store.dispatch(deleteMedia(mediaId));
      }
    });
  });

  // if any files are unknown, remove them
  const mediaDir = `${dirs.MainBundleDir}/Media`;
  RNFetchBlob.fs.exists(mediaDir).then(mdExists => {
    if (mdExists === true) {
      RNFetchBlob.fs.ls(mediaDir).then(list => {
        list.forEach(filename => {
          const filePath = `${mediaDir}/${filename}`;
          if (knownFiles.indexOf(filePath) === -1) {
            RNFetchBlob.fs.unlink(filePath);
          }
        });
      });
    }
  });
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

export const unsubscribe = callback => {
  _subscribers = _subscribers.filter(cb => cb !== callback);
};
