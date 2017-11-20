import Mixpanel from "react-native-mixpanel";

export const trackPlaybackPrevious = () => {
  Mixpanel.track("Playback Previous Tap");
};

export const trackPlaybackRewind = () => {
  Mixpanel.track("Playback Rewind Tap");
};

export const trackPlaybackPlay = () => {
  Mixpanel.track("Playback Play Tap");
};

export const trackPlaybackForward = () => {
  Mixpanel.track("Playback Forward Tap");
};

export const trackPlaybackNext = () => {
  Mixpanel.track("Playback Next Tap");
};

export const trackPlaybackVolume = Volume => {
  Mixpanel.trackWithProperites("Playback Volume Change", { Volume });
};

// MARK: tempo

export const startTempo = Tempo => {
  if (Tempo !== 1) {
    Mixpanel.timeEvent("Playback Tempo");
  }
};

export const trackTempo = Tempo => {
  if (Tempo !== 1) {
    Mixpanel.trackWithProperites("Playback Tempo", { Tempo });
  }
};

// MARK: scrubbing

export const trackScrub = Percent => {
  Mixpanel.trackWithProperites("Playback Scrub", { Percent });
};

// MARK: markers

export const trackMarkerTap = Name => {
  Mixpanel.trackWithProperites("Marker Tap", { Name });
};

export const trackMarkerHold = Name => {
  Mixpanel.trackWithProperites("Marker Hold", { Name });
};

export const trackChapterTap = Name => {
  Mixpanel.trackWithProperites("Chapter Tap", { Name });
};

// MARK: loops

export const trackLoopToggle = Enabled => {
  Mixpanel.trackWithProperites("Loop Toggle", { Enabled });
};

export const trackLoopLeft = Time => {
  const Side = "Left";
  Mixpanel.trackWithProperites("Loop Set", { Side, Time });
};

export const trackLoopRight = Time => {
  const Side = "Right";
  Mixpanel.trackWithProperites("Loop Set", { Side, Time });
};

export const trackLoopSave = Name => {
  Mixpanel.trackWithProperites("Loop Save", { Name });
};

export const trackMyLoopsTap = () => {
  Mixpanel.track("My Loops Tap");
};
