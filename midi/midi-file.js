const midiFileParser = require("midi-file-parser");
const fs = require("fs");
const MidiTimingTrack = require("./midi-timing-track")
const MidiNoteTrack = require("./midi-note-track")
const MidiPatternTrack = require("./midi-pattern-track")

const parse = (filename) => {
  var file = require("fs").readFileSync(`${filename}.mid`, "binary");
  var midi = midiFileParser(file);
  fs.writeFileSync(`./${filename}.json`, JSON.stringify(midi, null, 2));

  var timingTrack = new MidiTimingTrack(midi.tracks[0], midi.header)
  var markers = timingTrack.markers
  var patterns = []
  var tuningTracks = []
  var guitarTracks = []
  console.log("MARKERS: ")
  console.log(markers)
  console.log(" ")

  midi.tracks.forEach((track, index) => {
    if (track[0].text !== undefined) {

      if (track[0].text.includes("FMP -") && track[0].text !== "FMP - Jam Bar") {
        var guitarTrack = new MidiNoteTrack(track, timingTrack.secondsForTicks)
        guitarTracks.push(guitarTrack)
        console.log(`Guitar: ${guitarTrack.name}`)
        console.log(`number of notes: ${guitarTrack.notes.length}`)
        console.log(` `)
      }

      if (track[0].text.includes("T -")) {
        var tuningTrack = new MidiNoteTrack(track, timingTrack.secondsForTicks)
        tuningTracks.push(tuningTrack)
        console.log(`Tuning: ${tuningTrack.name}`)
        console.log(`number of notes: ${tuningTrack.notes.length}`)
        console.log(`fineTuning: ${tuningTrack.fineTuneVal}`)
        console.log(` `)
        
      }

      if (track[0].text.includes("FMP - Jam Bar")) {
        var patternTrack = new MidiPatternTrack(track, timingTrack.secondsForTicks)
        patterns = patternTrack.patterns
        console.log(`JAM BAR`)
        console.log(`patterns: ${patterns}`)
        console.log(` `)
      }
    }
  })
};

parse("../rpn_test_dyer_maker");
