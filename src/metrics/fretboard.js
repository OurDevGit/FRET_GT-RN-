import Mixpanel from "react-native-mixpanel";
var activePartDates = {};
var SMARTFretboardPart = undefined;

// TODO
export const addActivePart = part => {
  activePartDates[part] = Date();
};

// TODO
export const removeActivePart = part => {
  trackActivePart(part);
  delete activePartDates[part];
};

// called in metrics/app.js
// TODO
export const startActiveParts = () => {
  for (var key in activePartDates) {
    activePartDates[key] = Date();
  }
};

// called in metrics/app.js
// TODO
export const trackActiveParts = () => {
  for (var key in activePartDates) {
    trackActivePart(key);
  }
};

// TODO
export const trackActivePart = Part => {
  if (activePartDates[Part] !== undefined) {
    let Duration = Date() - activePartDates[Part];
    Mixpanel.trackWithProperites("Guitar Part", { Part, Duration });
  }
};

// SMARTFretboard

// called in metrics/app.js
export const restartSMARTFretboard = () => {
  if (SMARTFretboardPart !== undefined) {
    Mixpanel.timeEvent("SMARTFretboard");
  }
};

// TODO
export const startSMARTFretboard = name => {
  SMARTFretboardPart = name;
  Mixpanel.timeEvent("SMARTFretboard");
};

// called in metrics/app.js
// TODO
export const trackSMARTFretboard = isFinished => {
  if (SMARTFretboardPart !== undefined) {
    let Part = SMARTFretboardPart;
    Mixpanel.trackWithProperites("Guitar Part", { Part });

    if (isFinished) {
      SMARTFretboardPart = undefined;
    }
  }
};
