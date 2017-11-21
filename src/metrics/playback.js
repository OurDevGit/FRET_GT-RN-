import Mixpanel from "react-native-mixpanel";
var currentTempo = 1;

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
  Mixpanel.trackWithProperties("Playback Volume Change", { Volume });
};

// tempo
// called in metrics/app.js
export const restartTempo = () => {
  if (currentTempo !== 1) {
    Mixpanel.timeEvent("Playback Tempo");
  }
};

// called in metrics/app.js
export const trackTempo = () => {
  if (currentTempo !== 1) {
    Mixpanel.trackWithProperties("Playback Tempo", { Tempo: currentTempo });
  }
};

// TODO
export const startTempo = Tempo => {
  if (currentTempo !== 1) {
    Mixpanel.trackWithProperties("Playback Tempo", { Tempo: currentTempo });
  }

  if (Tempo !== 1) {
    Mixpanel.timeEvent("Playback Tempo");
  }

  currentTempo = Tempo;
};

// scrubbing
// TODO
export const trackScrub = Percent => {
  Mixpanel.trackWithProperties("Playback Scrub", { Percent });
};

// markers
// TODO
export const trackMarkerTap = Name => {
  Mixpanel.trackWithProperties("Marker Tap", { Name });
};

// TODO
export const trackMarkerHold = Name => {
  Mixpanel.trackWithProperties("Marker Hold", { Name });
};

// TODO
export const trackChapterTap = Name => {
  Mixpanel.trackWithProperties("Chapter Tap", { Name });
};

// loops
// TODO
export const trackLoopToggle = Enabled => {
  Mixpanel.trackWithProperties("Loop Toggle", { Enabled });
};

// TODO
export const trackLoopLeft = Time => {
  const Side = "Left";
  Mixpanel.trackWithProperties("Loop Set", { Side, Time });
};

// TODO
export const trackLoopRight = Time => {
  const Side = "Right";
  Mixpanel.trackWithProperties("Loop Set", { Side, Time });
};

// TODO
export const trackLoopSave = Name => {
  Mixpanel.trackWithProperties("Loop Save", { Name });
};

// TODO
export const trackMyLoopsTap = () => {
  Mixpanel.track("My Loops Tap");
};
