import Mixpanel from "react-native-mixpanel";

// TODO
export const trackPlaybackPrevious = () => {
  Mixpanel.track("Playback Previous Tap");
};

// TODO
export const trackPlaybackRewind = () => {
  Mixpanel.track("Playback Rewind Tap");
};

// TODO
export const trackPlaybackPlay = () => {
  Mixpanel.track("Playback Play Tap");
};

// TODO
export const trackPlaybackForward = () => {
  Mixpanel.track("Playback Forward Tap");
};

// TODO
export const trackPlaybackNext = () => {
  Mixpanel.track("Playback Next Tap");
};

// TODO
export const trackPlaybackVolume = Volume => {
  Mixpanel.trackWithProperites("Playback Volume Change", { Volume });
};

// tempo
// TODO
export const startTempo = Tempo => {
  if (Tempo !== 1) {
    Mixpanel.timeEvent("Playback Tempo");
  }
};

// TODO
export const trackTempo = Tempo => {
  if (Tempo !== 1) {
    Mixpanel.trackWithProperites("Playback Tempo", { Tempo });
  }
};

// scrubbing
// TODO
export const trackScrub = Percent => {
  Mixpanel.trackWithProperites("Playback Scrub", { Percent });
};

// markers
// TODO
export const trackMarkerTap = Name => {
  Mixpanel.trackWithProperites("Marker Tap", { Name });
};

// TODO
export const trackMarkerHold = Name => {
  Mixpanel.trackWithProperites("Marker Hold", { Name });
};

// TODO
export const trackChapterTap = Name => {
  Mixpanel.trackWithProperites("Chapter Tap", { Name });
};

// loops
// TODO
export const trackLoopToggle = Enabled => {
  Mixpanel.trackWithProperites("Loop Toggle", { Enabled });
};

// TODO
export const trackLoopLeft = Time => {
  const Side = "Left";
  Mixpanel.trackWithProperites("Loop Set", { Side, Time });
};

// TODO
export const trackLoopRight = Time => {
  const Side = "Right";
  Mixpanel.trackWithProperites("Loop Set", { Side, Time });
};

// TODO
export const trackLoopSave = Name => {
  Mixpanel.trackWithProperites("Loop Save", { Name });
};

// TODO
export const trackMyLoopsTap = () => {
  Mixpanel.track("My Loops Tap");
};
