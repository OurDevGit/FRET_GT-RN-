import RNFetchBlob from "react-native-fetch-blob";
import {
  downloadProgress,
  finishDownload,
  setDownloads
} from "./redux/actions";
import { setDownload, getAllDownloads } from "./models/Downloads";
import { guid } from "./utils";

// const android = RNFetchBlob.android;
const dirs = RNFetchBlob.fs.dirs;

let _dispatchProgress = () => {
  console.warn("_dispatchProgress is not hooked up in DownloadManager");
};

let _dispatchFinish = () => {
  console.warn("_dispatchFinish is not hooked up in DownloadManager");
};

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

  return unescape(path);
};

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

// const findExt = (files, targetExt) => {
//   var foundFiles = [];
//   files.forEach(file => {
//     const url = file.url;
//     const parts = url.split(".");
//     const last = parts[parts.length - 1];
//     const ext = last.split("?")[0];

//     if (ext.toLowerCase() === targetExt.toLowerCase()) {
//       foundFiles.push(file);
//     }
//   });

//   return foundFiles;
// };

export const downloadMediaFiles = async (files, mediaId) => {
  // console.debug({ files });
  // const song = findExt(files, "m4a")[0];
  // const video = findExt(files, "mp4")[0];
  // const mediaType = video !== undefined ? "video" : "song";

  const filesMap = await downloadFiles(files.map(f => f.url), progress => {
    console.debug(mediaId, progress);
    _dispatchProgress(mediaId, progress);
  });

  console.debug(filesMap);
  return filesMap;

  // console.debug({ mediaType });
  // console.debug({ song });
  // console.debug({ midis });
  // console.debug({ video });

  // const mediaFileURL = mediaType === "video" ? video.url : song.url;
  // const midiURLs = midis.map(m => m.url);

  // return new Promise((resolve, reject) => {
  //   let mediaFileTotal = 0;
  //   let midiTotal = 0;
  //   let mediaFileReceived = 0;
  //   let midiReceived = 0;
  //   let mediaPath = null;
  //   let midiPaths = null;

  //   const sendProgress = () => {
  //     const progress =
  //       (mediaFileReceived + midiReceived) / (mediaFileTotal + midiTotal);
  //     console.debug(progress);
  //     _dispatchProgress({
  //       [mediaId.toLowerCase()]: progress
  //     });
  //   };

  //   const mediaPromise = downloadFile(mediaFileURL)
  //     .progress({ interval: 250 }, (received, total) => {
  //       mediaFileReceived = received;
  //       mediaFileTotal = total;
  //       sendProgress();
  //     })
  //     .then(res => {
  //       console.debug("media file done!");
  //       mediaPath = res.path();
  //     });

  //   const midiPromise = downloadFiles(midiURLs).then(res => {
  //     console.debug("midis done!");
  //     console.debug(res);
  //     midiPaths = res;
  //   });

  //   Promise.all([mediaPromise, midiPromise]).then(result => {
  //     console.debug(`done downloading ${mediaId}`);
  //     var files = {};
  //     if (mediaType === "song") {
  //       files = {
  //         midiPath: midiPaths[0],
  //         mediaPath,
  //         mediaType
  //       };
  //     } else {
  //       files = {
  //         mediaPath,
  //         midiPaths,
  //         mediaType
  //       };
  //     }
  //     resolve(files);
  //     _dispatchFinish({ [mediaId]: files });
  //   });
  // });
};

export const configureDownloadManager = async store => {
  _dispatchProgress = (mediaId, progress) => {
    store.dispatch(downloadProgress(mediaId, progress));
  };

  _dispatchFinish = fileMap => {
    console.debug("finishing DL");
    console.debug(fileMap);
    store.dispatch(finishDownload(fileMap));
  };

  const allDownloads = await getAllDownloads();
  store.dispatch(setDownloads(allDownloads));

  console.debug("DL manager is configured");
};
