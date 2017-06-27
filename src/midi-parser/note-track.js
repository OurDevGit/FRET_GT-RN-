
module.exports = (track, secondsForTicks) => {
  var name, shortName, notes, tuning, fullTuning, fineTuneVal, capo, isBass
    
  notes = []

  var notesOn = []
  var totalTicks = 0
  const stringOffset = [64, 59, 55, 50, 45, 40]
  
	track.forEach((event, index) => {
    if (event.text !== undefined) {
      
      // removing track info from track name
      var edited = event.text.replace("FMP - ", "")
      edited = edited.replace("T - ", "")
      edited = edited.replace("Gtr", "Guitar ")
      name = edited

      // determine capo by (Capo ...) string in name
      if (edited.includes("(Capo ")) {
        var capoIndex = edited.indexOf("(Capo ")
        var str = edited.substr(capoIndex)
        str = str.replace("(Capo ", "").replace(")", "")
        
        if (parseInt(str) !== undefined) {
          capo = parseInt(str)
        }
        
        edited = edited.substr(capoIndex)
      }

      // determine tuning by (Tune ...) string in name
      if (edited.includes("(Tune ")) {
        var tuneIndex = edited.indexOf("(Tune ")
        var str = edited.substr(tuneIndex)
        str = str.replace("(Tune ", "").replace(")", "")

        tuning = str
        edited = edited.substr(tuneIndex)
      }

      // determine tuning by (DADG) string in name
      if (edited.includes("(")) {
        var parenIndex = edited.indexOf("(")
        var str = edited.substr(parenIndex)
        str = str.replace("(", "").replace(")", "")

        fullTuning = str
        edited = edited.substr(parenIndex)
      }

      isBass = edited.includes("Bass")

      // removing all extra info from track name
      shortName = edited
    }

    if (event.deltaTime !== undefined) {
      totalTicks += event.deltaTime
    }
    
    // setting noteOn from event, waiting for corresponding noteOff
    if (event.subtype === "noteOn" && event.velocity > 0) {
      event.begin = secondsForTicks(totalTicks)
      notesOn.push(event)
    
    // combining noteOn and noteOff into full note object
    } else if (event.subtype === "noteOff") {
      for (var i = 0; i < notesOn.length; i++) {
        var noteOn = notesOn[i]

        if (event.channel === noteOn.channel && event.noteNumber === noteOn.noteNumber) {
          var note = {}
          note.track = name
          note.string = noteOn.channel - 10
          note.fret = noteOn.noteNumber - stringOffset[note.string]
          note.begin = noteOn.begin
          note.end = secondsForTicks(totalTicks)
          
          notes.push(note)
          notesOn.splice(i, 1)
        }
      }
    
    // fine tuning value for track
    } else if (event.subtype === "controller" && event.controllerType === 101) {
      var rpn101 = track[index].value
      var rpn100 = track[index + 1].value
      var val6 = track[index + 2].value
      var val38 = track[index + 3].value

      // 0, 1 is fine tuning
      if (rpn101 === 0 && rpn100 === 1) {
        var leftBits = parseInt(val6) << 7
        var rightBits = parseInt(val38)
        fineTuneVal = leftBits | rightBits
      }
    }
  });

  var returnObj = { name, shortName, notes, tuning, fullTuning, isBass }

  if (capo !== undefined) {
    returnObj.capo = capo
  }

  if (fineTuneVal !== undefined) {
    returnObj.fineTuneVal = fineTuneVal
  }

  return returnObj
}
