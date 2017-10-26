// this is a simple, non-redux store for getting and setting current media time
var callbacks = [];
var currentTime = 0;

var updateSubscribers = () => {
  callbacks.forEach(callback => callback(currentTime));
};

// setters - only used by Music.js and Video.js to update current time

module.exports.setTime = time => {
  if (currentTime !== time) {
    currentTime = time;
    updateSubscribers();
  }
};

// getters

module.exports.getCurrentTime = () => {
  return currentTime;
};

// register callbacks
module.exports.subscribeToTimeUpdates = callback => {
  callbacks.push(callback);
  callback(currentTime);
};

module.exports.unsubscribeToTimeUpdates = callback => {
  callbacks = callbacks.filter(cb => cb !== callback);
};

module.exports.clearTimeStore = callback => {
  currentTime = 0;
  callbacks = [];
};
