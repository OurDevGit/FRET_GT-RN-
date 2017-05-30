
// private
var tempos = []
var ticksPerBeat = 0


module.exports = TimingTrack

function TimingTrack(track, headerTicksPerBeat) {
	
  var markers = []
  var microsecondsPerBeat = 0
  var totalEventTime = 0

  ticksPerBeat = headerTicksPerBeat

  console.log("MARKERS: ")
  track.forEach((event, index) => {
    if (event.subtype === "timeSignature") {
      var tempo = track[index + 2]
      if (tempo.microsecondsPerBeat !== undefined) {
        microsecondsPerBeat = tempo.microsecondsPerBeat
      }
    }
    
    if (event.deltaTime !== undefined) {
      var beats = event.deltaTime / ticksPerBeat
      var seconds = beats * microsecondsPerBeat / 1000000

      totalEventTime += seconds

      tempos.push({microsecondsPerBeat : microsecondsPerBeat, beats: beats})

      if (event.microsecondsPerBeat !== undefined) {
        microsecondsPerBeat = event.microsecondsPerBeat
      }
    }

    if (event.type === "meta" && event.text !== undefined) {
      if (event.text.includes("FMP -")) {
        var name = event.text.replace("FMP - ", "")
        markers.push({name: name, time: totalEventTime})
        console.log(`marker: ${name}; time: ${totalEventTime};`)
      }
    }
  });

}

TimingTrack.prototype.timeForBeats = (beats) => {
  var microseconds = 0
  var totalBeats = 0
  
  for (var i = 0; i < tempos.length; i++) {
    var tempo = tempos[i]
    
    if (beats > totalBeats + tempo.beats) {
      microseconds += (tempo.beats * tempo.microsecondsPerBeat)
      totalBeats += tempo.beats
    } else {
      var diff = beats - totalBeats
      microseconds += (diff * tempo.microsecondsPerBeat)
      totalBeats += tempo.beats
      break
    }
  }

  if (beats > totalBeats) {
    var lastTempo = tempos[tempos.length - 1]
    var diff = beats - totalBeats
    microseconds += (diff * lastTempo.microsecondsPerBeat)
  }

  return microseconds / 1000000
};
