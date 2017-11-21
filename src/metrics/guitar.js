import Mixpanel from "react-native-mixpanel";
var guitarDates = {};

// TODO
export const addGuitar = guitarId => {
  guitarDates[guitarId] = Date();
  trackGuitarCount();
};

// TODO
export const removeGuitar = guitarId => {
  trackGuitar(guitarId);
  delete guitarDates[guitarId];
};

// TODO
export const updateGuitarPart = guitarId => {
  trackGuitar(guitarId);
  trackGuitarCount();
};

// TODO
export const startConnectedGuitars = () => {
  guitarDates.forEach(guitarId => {
    guitarDates[guitarId] = Date();
  });
};

// TODO
export const trackConnectedGuitars = () => {
  guitarDates.forEach(guitarId => {
    trackGuitar(guitarId);
  });
};

// TODO
const trackGuitarCount = () => {
  if (guitarDates.length.length > 0) {
    let Count = guitarDates.length;
    Mixpanel.trackWithProperites("Guitar Count", { Count });
  }

  Mixpanel.timeEvent("Guitar Count");
};

// TODO
const trackGuitar = (guitarId, trackName) => {
  if (guitarDates[guitarId] !== undefined) {
    let Duration = Date() - guitarDates[guitarId];
    let Part = trackName;
    let Count = guitarDates.length;

    Mixpanel.trackWithProperites("Guitar Connect", { Duration, Part, Count });
  }
};
