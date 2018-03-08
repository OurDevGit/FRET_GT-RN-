import { Set } from "immutable";
import { getAllMedia } from "../../redux/selectors";
import { version } from "../../../package";

var _lastDlMediaIds = Set();

export const mapStateToProps = state => {
  // console.debug("mapping state in Home");

  // get downloads and purchases from state
  const downloadedMediaIds = Set.fromKeys(state.get("downloadedMedia"));
  const purchasedIds = state.get("purchasedMedia");

  // if the downloaded media ids change, we need to set a prop accordingly so that we know to reload the web view (by setting a new trigger query param in componentWillReceiveProps)
  const dlMediaIdsDidChange = downloadedMediaIds.equals(_lastDlMediaIds);
  _lastDlMediaIds = downloadedMediaIds;

  // purchases will be lowercase for Google IAB, but we need the upper-case versions
  const allMediaIds = getAllMedia(state)
    .toJS()
    .map(m => m.mediaID);
  const purchasedMediaIds = allMediaIds.filter(id =>
    purchasedIds.includes(id.toLowerCase())
  );

  // combine downloads and purchases
  const allIds = downloadedMediaIds.union(purchasedMediaIds);

  // map them for what the webview expects
  const purchasedMedia = allIds
    .map(id => ({
      purchaseId: id,
      isCached: downloadedMediaIds.includes(id)
    }))
    .toJS();

  const releaseVersion = state.get("appConfig").get("releaseVersion");
  const environment = getEnvironmentFromVersions(releaseVersion, version);
  return {
    purchasedMedia,
    environment,
    downloadedMediaIds: downloadedMediaIds,
    dlMediaIdsDidChange
  };
};

const getEnvironmentFromVersions = (releaseVersion, currentVersion) => {
  if (releaseVersion !== undefined) {
    const release = releaseVersion.split(".").map(str => parseInt(str));
    const current = currentVersion.split(".").map(str => parseInt(str));

    if (current[0] > release[0]) {
      return "sandbox";
    } else if (current[0] === release[0] && current[1] > release[1]) {
      return "sandbox";
    } else if (
      current[0] === release[0] &&
      current[1] === release[1] &&
      current[2] > release[2]
    ) {
      return "sandbox";
    }
  }

  return "production";
};
