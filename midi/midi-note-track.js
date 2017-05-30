
// private
const stringOffset = [64, 59, 55, 50, 45, 40]
var notesOn = []
var totalTicks = 0

module.exports = MidiNoteTrack

function MidiNoteTrack(track, secondsForTicks) {
  this.notes = []

	track.forEach(event => {
      if (event.text !== undefined) {
        
        // removing track info from track name
        var edited = event.text.replace("T - ", "")
        edited = edited.replace("T - ", "")
        this.name = edited

        // determine capo by (Capo ...) string in name
        if (edited.includes("(Capo ")) {
          var index = edited.indexOf("(Capo ")
          var str = edited.substr(index)
          str = str.replace("(Capo ", "")
          str = str.replace(")", "")
          this.capo = parseInt(str)
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
            notesOn.splice(i, 1)
            break
          }
        }
      } else if (event.subtype === "controller") {
        // console.log({
        //   type: event.controllerType,
        //   track: event.value
        // });
      }
    });
}
