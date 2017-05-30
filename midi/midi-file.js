const midiFileParser = require("midi-file-parser");
const fs = require("fs");
const MidiTimingTrack = require("./midi-timing-track")
const MidiNoteTrack = require("./midi-note-track")
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
        var tuningTrack = new MidiNoteTrack(track, timingTrack.secondsForTicks)
        console.log("TUNING: ", tuningTrack.name)
        console.log(tuningTrack.notes)
        console.log(" ")
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
