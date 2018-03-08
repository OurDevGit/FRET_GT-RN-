import { fetchHome } from "../../api";
import { downloadFiles } from "../../DownloadManager";
import { setPages, getPages, setSync, getSync } from "../../models/HomeCache";

export const getHomePages = () => getPages();

export const sync = async (environment, device, level, forceUpdate) => {
  if (forceUpdate) {
    await setSync(0);
  }
  const syncTime = await getSync();
  const homeFiles = await fetchHome(environment, device, level, syncTime);
  try {
    const downloadedFiles = await downloadFiles(homeFiles, 0, "Home", false);
    const env =
      environment === "sandbox"
        ? "home-android/STAGING/home"
        : "home-android/LIVE/home";
    const path = `${env}-${device}-${level}`;
    const index = downloadedFiles[`${path}/index.html`];
    const firstRun = downloadedFiles[`${path}/first-run.html`];
    await setPages(index, firstRun);
    const now = new Date().valueOf() / 1000;
    await setSync(now);
    return { index, firstRun };
  } catch (err) {
    console.log("ERROR DOWNLOADING HOME FILES");
    return "";
  }

  // console.debug("did sync Home");
  // console.debug({ now });
};
