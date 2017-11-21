import Mixpanel from "react-native-mixpanel";

// TODO: implement during development of chords and scales
export const startChordsAndScales = () => {
  Mixpanel.timeEvent("Chords and Scales");
};

export const trackChordsAndScales = () => {
  Mixpanel.track("Chords and Scales");
};

export const trackChordsAndScalesPattern = id => {
  Mixpanel.trackWithProperites("Chords and Scales Pattern", { id });
};

export const startJamBar = () => {
  Mixpanel.timeEvent("JamBar");
};

export const trackJamBar = () => {
  Mixpanel.track("JamBar");
};

export const trackJamBarPattern = id => {
  Mixpanel.trackWithProperites("Chords and Scales Pattern", { id });
};
