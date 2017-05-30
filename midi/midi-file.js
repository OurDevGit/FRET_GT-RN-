const midiFileParser = require("midi-file-parser");
const fs = require("fs");
const MidiTimingTrack = require("./midi-timing-track")
const MidiPatternTrack = require("./midi-pattern-track")

const parse = (filename) => {
  // ✔︎ time/beats
  // ✔︎ tracks
  // ✔︎ markers
  // ✔︎ patterns / jambar
  // ✔︎ tuning
  // notes
  // rpn

  var file = require("fs").readFileSync(`${filename}.mid`, "binary");
  var midi = midiFileParser(file);
  fs.writeFileSync(`./${filename}.json`, JSON.stringify(midi, null, 2));

  var timingTrack = new MidiTimingTrack(midi.tracks[0], midi.header)
  var markers = timingTrack.markers
  var patterns = []
  //console.log("MARKERS: ")
  //console.log(markers)
  //console.log(" ")

  midi.tracks.forEach(track => {
    if (track[0].text !== undefined) {

      if (track[0].text.includes("FMP -") && track[0].text !== "FMP - Jam Bar") {
        
      }

      if (track[0].text.includes("T -")) {

      }

      if (track[0].text.includes("FMP - Jam Bar")) {
        var patternTrack = new MidiPatternTrack(track, timingTrack.secondsForTicks)
        patterns = patternTrack.patterns
        console.log("JAM BAR: ")
        console.log(patterns)
        console.log(" ")
      }
    }
  })

/*
  var guitarTracks = midi.tracks.filter(arr => {
    return (arr[0].text.includes("FMP -") && arr[0].text !== "FMP - Jam Bar")
  })

  var tuningTracks = midi.tracks.filter(arr => {
    return arr[0].text.includes("T -")
  })

  

  if (tuningTracks.length > 0) {
    console.log("TUNING: ")
    const stringOffset = [64, 59, 55, 50, 45, 40]

    tuningTracks.forEach(track => {

      var totalEventBeats = 0
      var notes = []
      var notesOn = []
      
      track.forEach(event => {
        
        //console.log(event)
        if (event.text !== undefined) {
          if (event.text.includes("T - ")) {
            var name = event.text.replace("T - ", "")
            console.log(`Tuning Track: ${name}`)
          }
        }

        if (event.deltaTime !== undefined) {
          totalEventBeats += (event.deltaTime / midi.header.ticksPerBeat)
        }
        
        if (event.subtype === "noteOn") {
            if (event.velocity > 0) {
              event.begin = timingTrack.timeForBeats(totalEventBeats)
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
                note.end = timingTrack.timeForBeats(totalEventBeats)
                console.log('string: ', note.string, '; fret: ', note.fret, '; begin: ', note.begin, '; end: ', note.end)
                
                notes.push(note)
                notesOn.splice(i, 0)
                break
              }
            }
          }
      });
    });
  }
*/
  midi.tracks.forEach(track => {
    track.forEach(event => {
      if (event.subtype !== "noteOn" && event.subtype !== "noteOff") {
        // console.log(event.type, event.subtype);

        if (event.subtype === "controller") {
          /*console.log({
            type: event.controllerType,
            track: event.value
          });*/
        }

        /*
        if (event.subtype === "controller") {
          console.log({
            type: event.controllerType,
            val: event.value
          });
        }*/
      }
    });
  });

  // console.log(JSON.stringify(midi, null, 2));
};



parse("../walk_away");
