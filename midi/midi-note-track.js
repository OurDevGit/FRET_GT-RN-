
// private
const stringOffset = [64, 59, 55, 50, 45, 40]
var notesOn = []
var totalTicks = 0

module.exports = MidiNoteTrack

function MidiNoteTrack(track, secondsForTicks) {
  this.notes = []

	track.forEach(event => {
      if (event.text !== undefined) {
        if (event.text.includes("T - ")) {
          this.name = event.text.replace("T - ", "")
        }
      }

      if (event.deltaTime !== undefined) {
        totalTicks += event.deltaTime
      }
      
      if (event.subtype === "noteOn") {
          if (event.velocity > 0) {
            event.begin = secondsForTicks(totalTicks)
            notesOn.push(event)
          }
        } else if (event.subtype === "noteOff") {
          for (var i = 0; i < notesOn.length; i++) {
            var noteOn = notesOn[i]

            if (event.channel === noteOn.channel && event.noteNumber == noteOn.noteNumber) {
              var note = {}
              note.string = noteOn.channel - 10
              note.fret = noteOn.noteNumber - stringOffset[note.string]
              note.begin = noteOn.begin
              note.end = secondsForTicks(totalTicks)

              this.notes.push(note)
              notesOn.splice(i, 0)
              break
            }
          }
        }
    });
}
