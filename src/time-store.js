// this is a simple, non-redux store for getting and setting current media time
var callbacks = []
var currentTime = 0
var duration = 0

var updateSubscribers = () => {
  var progress = duration > 0 ? currentTime / duration : 0
  var payload = {time: currentTime, progress: progress, duration: duration}
  callbacks.forEach(callback => callback(payload))
}

// USED ONLY BY PLAYBACK.INDEX.JS TO UPDATE CURRENT TIME

// setters

module.exports.setCurrentTime = time => {
  if (currentTime !== time) {
    currentTime = time
    updateSubscribers()
  }
}

module.exports.setDuration = time => {
  if (duration !== time) {
    duration = time
    updateSubscribers()
  }
  
}

module.exports.setProgress = percent => {
  var newTime = percent * duration
  if (currentTime !== newTime) {
    currentTime = newTime
    updateSubscribers()
  }
}

// getters

module.exports.getCurrentTime = () => {
  return currentTime
}

module.exports.getDuration = () => {
  return duration
}

module.exports.getProgress = () => {
  return duration > 0 ? currentTime / duration : 0
}

// USED BY ALL OTHER COMPONENTS INTERESTED IN CURRENT TIME

// register callbacks
module.exports.subscribeToTimeUpdates = callback => {
  callbacks.push(callback)
}

module.exports.clearTimeStore = callback => {
  currentTime = 0
  duration = 0
  callbacks = []
}