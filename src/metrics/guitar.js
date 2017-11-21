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

// called in metrics/app.js
// TODO
export const startConnectedGuitars = () => {
  for (var key in guitarDates) {
    guitarDates[key] = Date();
  }
};

// called in metrics/app.js
// TODO
export const trackConnectedGuitars = () => {
  for (var key in guitarDates) {
    trackGuitar(key);
  }
};

// called in metrics/app.js
export const startGuitarCount = () => {
  Mixpanel.timeEvent("Guitar Count");
};

// called internally and in metrics/app.js
export const trackGuitarCount = () => {
  var Count = 0;
  for (var key in guitarDates) {
    if (guitarDates.hasOwnProperty(key)) {
      Count += 1;
    }
  }

  if (Count > 0) {
    Mixpanel.trackWithProperites("Guitar Count", { Count });
  }

  Mixpanel.timeEvent("Guitar Count");
};

// called internally
const trackGuitar = (guitarId, trackName) => {
  if (guitarDates[guitarId] !== undefined) {
    let Duration = Date() - guitarDates[guitarId];
    let Part = trackName;
    let Count = guitarDates.length;

    Mixpanel.trackWithProperites("Guitar Connect", { Duration, Part, Count });
  }
};
