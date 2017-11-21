import Mixpanel from "react-native-mixpanel";

// called in Song.js and Video.js
export const trackFretlightInfoTap = () => {
  Mixpanel.track("Fretlight Info Tap");
};

// called in Song.js and Video.js
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

  Mixpanel.trackWithProperites("Ad Tap", props);
};

// called in Fretboard.js
export const trackTuningTap = () => {
  Mixpanel.track("Tuning Tap");
};

// settings

// TODO
export const trackSettingsAbout = () => {
  Mixpanel.track("Settings About Tap");
};

// TODO
export const trackSettingsHelp = () => {
  Mixpanel.track("Settings Help Tap");
};

// TODO
export const trackSettingsControls = () => {
  Mixpanel.track("Settings Controls Tap");
};

// TODO
export const trackSettingsCountdown = On => {
  Mixpanel.trackWithProperites("Settings Countdown Toggle", { On });
};

// TODO
export const trackSettingsLefy = On => {
  Mixpanel.trackWithProperites("Settings Left Toggle", { On });
};

// TODO
export const trackSettingsFretlightAutoPartSwitching = On => {
  Mixpanel.trackWithProperites("Settings FretlightAutoPartSwitching Toggle", {
    On
  });
};

// TODO
export const trackSettingsNoteNotation = Notation => {
  Mixpanel.trackWithProperites("Settings Notation Selection", { Notation });
};
