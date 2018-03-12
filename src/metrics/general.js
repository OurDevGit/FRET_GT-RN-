import Mixpanel from "react-native-mixpanel";

// called in Song.js and Video.js
export const trackFretlightInfoTap = () => {
  Mixpanel.track("Fretlight Info Tap");
};

// called in Song.js and Video.js and chords-and-scales/index.js
export const trackFretlightStatusTap = () => {
  Mixpanel.track("Fretlight Status Tap");
};

// called in AdContainer.js
export const trackAdTap = (url, tracking) => {
  var props = {};

  if (url !== undefined) {
    props["URL"] = url;
  }

  if (tracking !== undefined) {
    props["tracking"] = tracking;
  }

  Mixpanel.trackWithProperties("Ad Tap", props);
};

// called in Fretboard.js
export const trackTuningTap = () => {
  Mixpanel.track("Tuning Tap");
};

// settings
// all called in settings/index.js
export const trackSettingsAbout = () => {
  Mixpanel.track("Settings About Tap");
};

export const trackSettingsHelp = () => {
  Mixpanel.track("Settings Help Tap");
};

export const trackSettingsControls = () => {
  Mixpanel.track("Settings Controls Tap");
};

export const trackSettingsCountdown = On => {
  Mixpanel.trackWithProperties("Settings Countdown Toggle", { On });
};

export const trackSettingsLefy = On => {
  Mixpanel.trackWithProperties("Settings Left Toggle", { On });
};

export const trackSettingsFretlightAutoPartSwitching = On => {
  Mixpanel.trackWithProperties("Settings FretlightAutoPartSwitching Toggle", {
    On
  });
};

export const trackSettingsNoteNotation = Notation => {
  Mixpanel.trackWithProperties("Settings Notation Selection", { Notation });
};

export const trackEmailUpdateTap = () => {
  Mixpanel.track("Email Update Tap");
};

export const trackEmailContestTap = () => {
  Mixpanel.track("Email Contest Tap");
};
