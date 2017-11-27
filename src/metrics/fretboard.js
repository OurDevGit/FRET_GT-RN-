import Mixpanel from "react-native-mixpanel";
var activePartDates = {};
var SMARTFretboardPart = undefined;

// called in Fretboards.js (scrolling) and Playback.js (STEP)
export const updateActiveParts = parts => {
  parts.forEach(part => (activePartDates[part] = dateInSeconds()));
};

// called in TrackSelector.js
export const addActivePart = part => {
  console.log("adding Guitar Part", part);
  activePartDates[part] = dateInSeconds();
};

// called in TrackSelector.js
export const removeActivePart = part => {
  trackActivePart(part);
  delete activePartDates[part];
};

// called in metrics/app.js
export const startActiveParts = () => {
  for (var key in activePartDates) {
    activePartDates[key] = dateInSeconds();
  }
};

// called in metrics/app.js
export const trackActiveParts = () => {
  for (var key in activePartDates) {
    trackActivePart(key);
  }
};

// called internally
export const trackActivePart = Part => {
  if (activePartDates[Part] !== undefined) {
    let Duration = dateInSeconds() - activePartDates[Part];
    console.log("Guitar Part", Part, Duration);
    Mixpanel.trackWithProperties("Guitar Part", { Part, Duration });
  }
};

// SMARTFretboard
// called in metrics/app.js
export const restartSMARTFretboard = () => {
  if (SMARTFretboardPart !== undefined) {
    Mixpanel.timeEvent("SMARTFretboard");
  }
};

// called in Fretboard.js
export const startSMARTFretboard = name => {
  SMARTFretboardPart = name;
  Mixpanel.timeEvent("SMARTFretboard");
};

// called in metrics/app.js and Fretboard.js
export const trackSMARTFretboard = isFinished => {
  if (SMARTFretboardPart !== undefined) {
    let Part = SMARTFretboardPart;
    Mixpanel.trackWithProperties("SMARTFretboard", { Part });

    if (isFinished) {
      SMARTFretboardPart = undefined;
    }
  }
};

const dateInSeconds = () => {
  return Date.now() / 1000;
};
