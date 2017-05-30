
// private
var tempos = []
var ticksPerBeat = 0
var secondsPerTick = 0
var totalTicks = 0
var totalSeconds = 0
var markers = []

module.exports = TimingTrack

function TimingTrack(track, header) {
	ticksPerBeat = header.ticksPerBeat

  track.forEach((event, index) => {
    if (event.subtype === "timeSignature") {
      var tempo = track[index + 2]
      if (tempo.secondsPerTick !== undefined) {
        secondsPerTick = tempo.microsecondsPerBeat / ticksPerBeat
      }
    }
    
    if (event.deltaTime !== undefined) {
      totalTicks += event.deltaTime
      totalSeconds += event.deltaTime * secondsPerTick

      //console.log('ticks: ', event.deltaTime, '; rate: ', secondsPerTick)
      tempos.push({rate : secondsPerTick, ticks: event.deltaTime})

      if (event.microsecondsPerBeat !== undefined) {
        secondsPerTick = event.microsecondsPerBeat / ticksPerBeat
      }
    }

    if (event.type === "meta" && event.text !== undefined) {
      if (event.text.includes("FMP -")) {
        var name = event.text.replace("FMP - ", "")
        markers.push({name: name, time: totalSeconds})
      }
    }
  });
}

TimingTrack.prototype.markers = markers

TimingTrack.prototype.secondsForTicks = (ticks) => {
  var microseconds = 0
  var totalTicks = 0
  
  for (var i = 0; i < tempos.length; i++) {
    var tempo = tempos[i]
    
    if (ticks > totalTicks + tempo.ticks) {
      microseconds += (tempo.ticks * tempo.rate)
      totalTicks += tempo.ticks
    } else {
      var diff = ticks - totalTicks
      microseconds += (diff * tempo.rate)
      totalTicks += tempo.ticks
      break
    }
  }
  
  if (ticks > totalTicks) {
    var lastTempo = tempos[tempos.length - 1]
    var diff = ticks - totalTicks
    microseconds += (diff * lastTempo.rate)
  }

  return microseconds / 1000000
};
