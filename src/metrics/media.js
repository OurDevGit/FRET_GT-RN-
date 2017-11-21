import Mixpanel from "react-native-mixpanel";
import { trackActiveParts } from "./fretboard";

// TODO
export const startMedia = mediaId => {
  trackActiveParts;
  Mixpanel.trackWithProperties("Media Selected", { "Media ID": mediaId });
};

// TODO
export const startPlayback = () => {
  Mixpanel.timeEvent("Media Playback");
};

// TODO
export const stopPlayback = () => {
  Mixpanel.track("Media Playback");
};

// TODO
export const trackFavorite = (mediaId, isFavorite) => {
  Mixpanel.trackWithProperties("Media Favorite", {
    "Media ID": mediaId,
    Favorite: isFavorite
  });
};
