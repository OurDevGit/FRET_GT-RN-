import Mixpanel from "react-native-mixpanel";
var guitarDates = {};

export const addGuitar = guitarId => {
  guitarDates[guitarId] = Date();
  trackGuitarCount();
};

export const removeGuitar = guitarId => {
  trackGuitar(guitarId);
  delete guitarDates[guitarId];
};

export const updateGuitarPart = guitarId => {
  trackGuitar(guitarId);
  trackGuitarCount();
};

export const startConnectedGuitars = () => {
  guitarDates.forEach(guitarId => {
    guitarDates[guitarId] = Date();
  });
};

export const trackConnectedGuitars = () => {
  guitarDates.forEach(guitarId => {
    trackGuitar(guitarId);
  });
};

const trackGuitarCount = () => {
  if (guitarDates.length.length > 0) {
    let Count = guitarDates.length;
    Mixpanel.trackWithProperites("Guitar Count", { Count });
  }

  Mixpanel.timeEvent("Guitar Count");
};

const trackGuitar = (guitarId, trackName) => {
  if (guitarDates[guitarId] !== undefined) {
    let Duration = Date() - guitarDates[guitarId];
    let Part = trackName;
    let Count = guitarDates.length;

    Mixpanel.trackWithProperites("Guitar Connect", { Duration, Part, Count });
  }
};
