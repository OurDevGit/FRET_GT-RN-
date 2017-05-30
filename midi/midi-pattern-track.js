
module.exports = MidiPatternTrack

function MidiPatternTrack(track, secondsForTicks) {
  this.patterns = []
  var totalTicks = 0

	track.forEach(event => {
      if (event.deltaTime !== undefined) {
        totalTicks += event.deltaTime
      }

      if (event.subtype === "text" && event.text !== undefined) {
        if (event.text.includes("@IMP_PATTERN_SCALE")) {
          var arr = event.text.split(':');
          var time = secondsForTicks(totalTicks);
          this.patterns.push({key: arr[2], scale: arr[1], time: time})
        }
      }
    });
}

