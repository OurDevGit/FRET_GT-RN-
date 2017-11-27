// this is a simple, non-redux store for getting and setting current media time
var callbacks = [];
var currentTime = 0;

var updateSubscribers = () => {
  callbacks.forEach(callback => callback(currentTime));
};

// setters - only used by Music.js and Video.js to update current time

export const setTime = time => {
  if (currentTime !== time) {
    currentTime = time;
    updateSubscribers();
  }
};

// getters

export const getCurrentTime = () => {
  return currentTime;
};

// register callbacks
export const subscribeToTimeUpdates = callback => {
  callbacks.push(callback);
  callback(currentTime);
};

export const unsubscribeToTimeUpdates = callback => {
  callbacks = callbacks.filter(cb => cb !== callback);
};

export const clearTimeStore = () => {
  currentTime = 0;
  callbacks = [];
};
