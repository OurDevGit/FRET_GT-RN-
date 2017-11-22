import Mixpanel from "react-native-mixpanel";
var guitarDates = {};

// called in GuitarController.js
export const addGuitar = (guitarId, trackName) => {
  guitarDates[guitarId] = { date: dateInSeconds(), trackName };
  trackGuitarCount();
};

// called in GuitarController.js
export const removeGuitar = guitarId => {
  if (guitarDates[guitarId] !== undefined) {
    trackGuitar(guitarId);
    delete guitarDates[guitarId];
    trackGuitarCount();
  }
};

// called in FretlightAdmin/index.js and TrackSelector.js
export const updateGuitarPart = (guitarId, trackName) => {
  if (guitarDates[guitarId] !== undefined) {
    trackGuitar(guitarId);
    guitarDates[guitarId] = { date: dateInSeconds(), trackName };
  }
};

// called in metrics/app.js
export const startConnectedGuitars = () => {
  for (var key in guitarDates) {
    guitarDates[key].date = dateInSeconds();
  }
};

// called in metrics/app.js
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
  var Count = guitarCount();

  if (Count > 0) {
    Mixpanel.trackWithProperties("Guitar Count", { Count });
  }

  Mixpanel.timeEvent("Guitar Count");
};

// called internally
const trackGuitar = guitarId => {
  if (guitarDates[guitarId] !== undefined) {
    let Duration = dateInSeconds() - guitarDates[guitarId].date;
    let Part = guitarDates[guitarId].trackName;
    let Count = guitarCount();

    Mixpanel.trackWithProperties("Guitar Connect", { Duration, Part, Count });
  }
};

const dateInSeconds = () => {
  return Date.now() / 1000;
};

const guitarCount = () => {
  var num = 0;
  for (var key in guitarDates) {
    if (guitarDates.hasOwnProperty(key)) {
      num += 1;
    }
  }
  return num;
};
