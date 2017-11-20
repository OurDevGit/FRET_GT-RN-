import Mixpanel from "react-native-mixpanel";
import { trackActiveParts } from "./fretboard";

export const startMedia = mediaId => {
  trackActiveParts;
  Mixpanel.trackWithProperites("Media Selected", { "Media ID": mediaId });
};

// MARK: media playback
export const startPlayback = () => {
  Mixpanel.timeEvent("Media Playback");
};

export const stopPlayback = () => {
  Mixpanel.track("Media Playback");
};

// called when media is favorited or unfavorited
export const trackFavorite = (mediaId, isFavorite) => {
  Mixpanel.trackWithProperites("Media Favorite", {
    "Media ID": mediaId,
    Favorite: isFavorite
  });
};
