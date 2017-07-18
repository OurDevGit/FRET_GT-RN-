// returns markers and function to convert ticks to seconds for all other tracks
import { Map, List } from 'immutable'

module.exports = (track, header) => {
  var microsecondsPerTick = 0
  var totalTicks = 0
  var tempos = List()
  var markers = List()

  secondsForTicks = ticks => {
    var microseconds = 0
    var totalTicks = 0
    
    for (var i = 0; i < tempos.count(); i++) {
      var tempo = tempos.get(i)
      
      if (ticks > totalTicks + tempo.ticks) {
        microseconds += (tempo.get("ticks") * tempo.get("rate"))
        totalTicks += tempo.get("ticks")
      } else {
        var diff = ticks - totalTicks
        microseconds += (diff * tempo.get("rate"))
        totalTicks += tempo.get("ticks")
        break
      }
    }
    
    if (ticks > totalTicks) {
      var lastTempo = tempos.last()
      var diff = ticks - totalTicks
      microseconds += (diff * lastTempo.get("rate"))
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
      tempos = tempos.push(Map({rate : microsecondsPerTick, ticks: event.deltaTime}))

      if (event.microsecondsPerBeat !== undefined) {
        microsecondsPerTick = event.microsecondsPerBeat / header.ticksPerBeat
      }
    }

    if (event.type === "meta" && event.text !== undefined && event.text.includes("FMP -")) {
      var name = event.text.replace("FMP - ", "")
      var time = secondsForTicks(totalTicks)
      markers = markers.push(Map({name: name, time: time}))
    }
  });

  

  return { markers: markers, secondsForTicks: secondsForTicks }
}
