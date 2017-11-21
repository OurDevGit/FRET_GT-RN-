import Mixpanel from "react-native-mixpanel";
import { trackActiveParts } from "./fretboard";

// called in Root.js
export const startMedia = mediaId => {
  trackActiveParts;
  Mixpanel.trackWithProperties("Media Selected", { "Media ID": mediaId });
};

// called in Song.js and Video.js
export const startPlayback = () => {
  Mixpanel.timeEvent("Media Playback");
};

// called in Song.js and Video.js
export const stopPlayback = () => {
  Mixpanel.track("Media Playback");
};

// called in sagas.js
export const trackFavorite = (mediaId, isFavorite) => {
  Mixpanel.trackWithProperties("Media Favorite", {
    "Media ID": mediaId,
    Favorite: isFavorite
  });
};
