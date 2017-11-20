import Mixpanel from "react-native-mixpanel";

export const trackCategory = Title => {
  Mixpanel.trackWithProperites("Library Category", { Title });
};

export const trackFretlightInfoTap = () => {
  Mixpanel.track("Fretlight Info Tap");
};

export const trackFretlightStatusTap = () => {
  Mixpanel.track("Fretlight Status Tap");
};

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

export const trackTuningTap = () => {
  Mixpanel.track("Tuning Tap");
};

// settings

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
  Mixpanel.trackWithProperites("Settings Countdown Toggle", { On });
};

export const trackSettingsLefy = On => {
  Mixpanel.trackWithProperites("Settings Left Toggle", { On });
};

export const trackSettingsFretlightAutoPartSwitching = On => {
  Mixpanel.trackWithProperites("Settings FretlightAutoPartSwitching Toggle", {
    On
  });
};

export const trackSettingsNoteNotation = Notation => {
  Mixpanel.trackWithProperites("Settings Notation Selection", { Notation });
};
