import { fetchResource } from "../api";
import { downloadFiles } from "../DownloadManager";
import { getSync, setSync, setFile } from "../models/Resources";
import { getIsPhone } from "../utils";

const getNow = () => new Date().valueOf() / 1000;

const syncResource = async resource => {
  const syncTime = await getSync(resource);
  const apiResult = await fetchResource(resource, syncTime);
  const url = apiResult.url;
  if (url === null || url === undefined) {
    return null;
  } else {
    try {
      const localFiles = await downloadFiles([url], 0, "Resources", false);
      const file = localFiles[resource];
      await setSync(resource, getNow());
      await setFile(resource, file);
    } catch (err) {
      console.log("failed to download Resource");
    }
  }
};

export const syncResources = async () => {
  const isPhone = getIsPhone();

  syncResource("android/legal.pdf");

  if (isPhone) {
    syncResource("android/help-phone.pdf");
    syncResource("android/overlay-phone.pdf");
  } else {
    syncResource("android/help-tablet.pdf");
    syncResource("android/overlay-tablet.pdf");
  }
};
