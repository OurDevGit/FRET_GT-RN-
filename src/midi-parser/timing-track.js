// returns markers and function to convert ticks to seconds for all other tracks

module.exports = (track, header) => {
  var microsecondsPerTick = 0
  var totalTicks = 0
  var tempos = []
  var markers = []

  secondsForTicks = ticks => {
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
  }
	
  track.forEach((event, index) => {
    if (event.subtype === "timeSignature") {
      var tempo = track[index + 2]
      if (tempo.microsecondsPerTick !== undefined) {
        secondsPerTick = tempo.microsecondsPerBeat / header.ticksPerBeat
      }
    }
    
    if (event.deltaTime !== undefined) {
      totalTicks += event.deltaTime
      tempos.push({rate : microsecondsPerTick, ticks: event.deltaTime})

      if (event.microsecondsPerBeat !== undefined) {
        microsecondsPerTick = event.microsecondsPerBeat / header.ticksPerBeat
      }
    }

    if (event.type === "meta" && event.text !== undefined && event.text.includes("FMP -")) {
      var name = event.text.replace("FMP - ", "")
      var time = secondsForTicks(totalTicks)
      markers.push({name: name, time: time})
    }
  });

  

  return { markers: markers, secondsForTicks: secondsForTicks }
}