import { fetchHome } from "../../api";
import { downloadFiles } from "../../DownloadManager";
import { setIndex, getIndex, setSync, getSync } from "../../models/HomeCache";

export const getIndexFile = () => getIndex();

export const sync = async () => {
  // console.debug(`fetching Home`);
  const syncTime = await getSync();
  const homeFiles = await fetchHome(syncTime);

  // console.debug(`going to download ${homeFiles.length} files`);
  try {
    const downloadedFiles = await downloadFiles(homeFiles, 0, "Home", false);
    const indexFile = downloadedFiles["home/index.html"];
    await setIndex(indexFile);
    const now = new Date().valueOf() / 1000;
    await setSync(now);

    return indexFile;
  } catch (err) {
    console.log("error donwloading home files");

    return "";
  }

  // console.debug("did sync Home");
  // console.debug({ now });
};
