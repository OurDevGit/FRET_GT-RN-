import Mixpanel from "react-native-mixpanel";
var chordsAndScalesIsActive = false;
var jamBarIsActive = false;
// TODO: implement during development of chords and scales

// called in metrics/app.js
// TODO
export const startChordsAndScales = () => {
  if (chordsAndScalesIsActive) {
    Mixpanel.timeEvent("Chords and Scales");
  }
};

// called in metrics/app.js
// TODO
export const trackChordsAndScales = isFinished => {
  if (chordsAndScalesIsActive) {
    Mixpanel.track("Chords and Scales");
  }
  chordsAndScalesIsActive = isFinished;
};

// called in metrics/app.js
// TODO
export const trackChordsAndScalesPattern = id => {
  Mixpanel.trackWithProperties("Chords and Scales Pattern", { id });
};

// called in metrics/app.js
// TODO
export const startJamBar = () => {
  if (jamBarIsActive) {
    Mixpanel.timeEvent("JamBar");
  }
};

// called in metrics/app.js
// TODO
export const trackJamBar = isFinished => {
  if (jamBarIsActive) {
    Mixpanel.track("JamBar");
  }
  jamBarIsActive = isFinished;
};

// called in metrics/app.js
// TODO
export const trackJamBarPattern = id => {
  Mixpanel.trackWithProperties("JamBar Pattern Pattern", { id });
};
