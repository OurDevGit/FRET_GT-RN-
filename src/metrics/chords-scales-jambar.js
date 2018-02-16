import Mixpanel from "react-native-mixpanel";
var chordsAndScalesIsActive = false;
var jamBarIsActive = false;

// called in chords-and-scales/index.js
export const startChordsAndScales = () => {
  if (chordsAndScalesIsActive) {
    Mixpanel.timeEvent("Chords and Scales");
  }
};

// called in chords-and-scales/index.js
export const trackChordsAndScales = isFinished => {
  if (chordsAndScalesIsActive) {
    Mixpanel.track("Chords and Scales");
  }
  chordsAndScalesIsActive = isFinished;
};

// called in chords-and-scales/index.js
export const trackChordsAndScalesPattern = id => {
  Mixpanel.trackWithProperties("Chords and Scales Pattern", { id });
};

// called in jam-bar/index.js
export const startJamBar = () => {
  if (jamBarIsActive) {
    Mixpanel.timeEvent("JamBar");
  }
};

// called in jam-bar/index.js
export const trackJamBar = isFinished => {
  if (jamBarIsActive) {
    Mixpanel.track("JamBar");
  }
  jamBarIsActive = isFinished;
};

// called in jam-bar/index.js
export const trackJamBarPattern = id => {
  Mixpanel.trackWithProperties("JamBar Pattern", { id });
};
