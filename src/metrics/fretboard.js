import Mixpanel from "react-native-mixpanel";
var activePartDates = {};
var SMARTFretboardPart = "";

export const addActivePart = part => {
  activePartDates[part] = Date();
};

export const removeActivePart = part => {
  trackActivePart(part);
  delete activePartDates[part];
};

export const startActiveParts = () => {
  activePartDates.forEach(part => {
    activePartDates[part] = Date();
  });
};

export const trackActiveParts = () => {
  activePartDates.forEach(part => {
    trackActivePart(part);
  });
};

export const trackActivePart = Part => {
  if (activePartDates[Part] !== undefined) {
    let Duration = Date() - activePartDates[Part];
    Mixpanel.trackWithProperites("Guitar Part", { Part, Duration });
  }
};

// MARK: SMARTFretboard

export const startSMARTFretboard = name => {
  SMARTFretboardPart = name;
  Mixpanel.timeEvent("SMARTFretboard");
};

export const trackSMARTFretboard = isFinished => {
  if (SMARTFretboardPart !== undefined) {
    let Part = SMARTFretboardPart;
    Mixpanel.trackWithProperites("Guitar Part", { Part });

    if (isFinished) {
      SMARTFretboardPart = undefined;
    }
  }
};
