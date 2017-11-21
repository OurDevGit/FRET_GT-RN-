import Mixpanel from "react-native-mixpanel";
var activePartDates = {};
var SMARTFretboardPart = "";

// TODO
export const addActivePart = part => {
  activePartDates[part] = Date();
};

// TODO
export const removeActivePart = part => {
  trackActivePart(part);
  delete activePartDates[part];
};

// TODO
export const startActiveParts = () => {
  activePartDates.forEach(part => {
    activePartDates[part] = Date();
  });
};

// TODO
export const trackActiveParts = () => {
  activePartDates.forEach(part => {
    trackActivePart(part);
  });
};

// TODO
export const trackActivePart = Part => {
  if (activePartDates[Part] !== undefined) {
    let Duration = Date() - activePartDates[Part];
    Mixpanel.trackWithProperites("Guitar Part", { Part, Duration });
  }
};

// SMARTFretboard

// TODO
export const startSMARTFretboard = name => {
  SMARTFretboardPart = name;
  Mixpanel.timeEvent("SMARTFretboard");
};

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
