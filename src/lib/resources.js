import { fetchResource } from "../api";
import { downloadFiles } from "../DownloadManager";
import { getSync, setSync, setFile } from "../models/Resources";

const getNow = () => new Date().valueOf() / 1000;

const syncResource = async resource => {
  const syncTime = await getSync(resource);
  const apiResult = await fetchResource(resource, syncTime);
  const url = apiResult.url;
  if (url === null || url === undefined) {
    return null;
  } else {
    const localFiles = await downloadFiles([url], "Resources", false);
    const file = localFiles[resource];
    await setSync(resource, getNow());
    await setFile(resource, file);

    console.debug(`synced ${file}`);
  }
};

export const syncResources = async () => {
  syncResource("legal.pdf");
  syncResource("help-ipad.pdf");
  syncResource("overlay-ipad.pdf");
};
