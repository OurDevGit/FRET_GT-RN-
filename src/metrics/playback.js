import Mixpanel from "react-native-mixpanel";
var currentTempo = 1;

// called in Song.js and Video.js
export const trackPlaybackPrevious = () => {
  Mixpanel.track("Playback Previous Tap");
};

// called in Song.js and Video.js
export const trackPlaybackRewind = () => {
  Mixpanel.track("Playback Rewind Tap");
};

// called in Song.js and Video.js
export const trackPlaybackPlay = () => {
  Mixpanel.track("Playback Play Tap");
};

// called in Song.js and Video.js
export const trackPlaybackForward = () => {
  Mixpanel.track("Playback Forward Tap");
};

// called in Song.js and Video.js
export const trackPlaybackNext = () => {
  Mixpanel.track("Playback Next Tap");
};

// called in Volume.js
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

// called in metrics/app.js and Playback/index.js
export const trackTempo = () => {
  if (currentTempo !== 1) {
    Mixpanel.trackWithProperties("Playback Tempo", { Tempo: currentTempo });
  }
};

// called in Playback/index.js
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
// called in Song.js and Video.js
export const trackScrub = Percent => {
  Mixpanel.trackWithProperties("Playback Scrub", { Percent });
};

// markers
// called in Song.js and Video.js
export const trackMarkerTap = Name => {
  Mixpanel.trackWithProperties("Marker Tap", { Name });
};

// called in Song.js
export const trackMarkerHold = Name => {
  Mixpanel.trackWithProperties("Marker Hold", { Name });
};

// called in Video.js
export const trackChapterTap = Name => {
  Mixpanel.trackWithProperties("Chapter Tap", { Name });
};

// loops
// called in Song.js and Video.js
export const trackLoopToggle = Enabled => {
  Mixpanel.trackWithProperties("Loop Toggle", { Enabled });
};

// called in Song.js and Video.js
export const trackLoopLeft = Time => {
  const Side = "Left";
  Mixpanel.trackWithProperties("Loop Set", { Side, Time });
};

// called in Song.js and Video.js
export const trackLoopRight = Time => {
  const Side = "Right";
  Mixpanel.trackWithProperties("Loop Set", { Side, Time });
};

// called in BtnSaveLoopModal
export const trackLoopSave = Name => {
  Mixpanel.trackWithProperties("Loop Save", { Name });
};

// called in BtnMyLoopsModal
export const trackMyLoopsTap = () => {
  Mixpanel.track("My Loops Tap");
};
