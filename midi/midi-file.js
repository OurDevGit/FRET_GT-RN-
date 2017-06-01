const midiFileParser = require("midi-file-parser");
const fs = require("fs");
const MidiTimingTrack = require("./midi-timing-track")
const MidiNoteTrack = require("./midi-note-track")
const MidiPatternTrack = require("./midi-pattern-track")
var notes = []

module.exports = MidiFile

function MidiFile(filename) {
  this.markers
  this.patterns = []
  this.tuningTracks = []
  this.guitarTracks = []
  this.firstNote
  this.lastNote

  var file = require("fs").readFileSync(`${filename}.mid`, "binary");
  var midi = midiFileParser(file);
  fs.writeFileSync(`./${filename}.json`, JSON.stringify(midi, null, 2));

  var timingTrack = new MidiTimingTrack(midi.tracks[0], midi.header)
  this.markers = timingTrack.markers

  midi.tracks.forEach((arr, index) => {
    if (arr[0].text !== undefined) {

      // load guitar tracks
      if (arr[0].text.includes("FMP -") && arr[0].text !== "FMP - Jam Bar") {
        var track = new MidiNoteTrack(arr, timingTrack.secondsForTicks)
        notes = notes.concat(track.notes)
        delete track.notes
        this.guitarTracks.push(track)
      }

      // load tuning tracks
      if (arr[0].text.includes("T -")) {
        var track = new MidiNoteTrack(arr, timingTrack.secondsForTicks)
        this.tuningTracks.push(track)
      }

      // load jambar track
      if (arr[0].text.includes("FMP - Jam Bar")) {
        var patternTrack = new MidiPatternTrack(arr, timingTrack.secondsForTicks)
        this.patterns = patternTrack.patterns
      }
    }
  })

  var beginnings = notes.sort((a, b) => {
    return a.begin - b.begin
  })
  this.firstNote = beginnings[0]

  var endings = notes.sort((a, b) => {
    return b.end - a.end
  })
  this.lastNote = endings[0]
};

MidiFile.prototype.notesForTime = (time) => {
  var matching = notes.filter(note => {
    return note.begin <= time && note.end > time
  })

  return matching
}

var file = new MidiFile("../rpn_test_dyer_maker")
console.log(file.firstNote)
