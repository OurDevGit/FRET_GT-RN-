import { Dimensions } from "react-native";
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
    const localFiles = await downloadFiles([url], "Resources", false);
    const file = localFiles[resource];
    await setSync(resource, getNow());
    await setFile(resource, file);
  }
};

export const syncResources = async () => {
  const window = Dimensions.get("window");
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
