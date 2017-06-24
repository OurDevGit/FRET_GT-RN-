import RNFetchBlob from 'react-native-fetch-blob'
import { decode } from 'base-64'
import midiFileParser from 'midi-file-parser'
import { List, Set } from 'immutable'

import timingTrack from './timing-track'
import noteTrack from './note-track'
import patternTrack from './pattern-track'

module.exports = filename => {
  
  const path = RNFetchBlob.fs.asset(filename)
  return RNFetchBlob.fs.readFile(path, 'base64')
  .then(data => {
    var binary = decode(data);
    var midi = midiFileParser(binary);
    var { markers, secondsForTicks } = timingTrack(midi.tracks[0], midi.header)

    var guitarTracks = []
    var tuningTracks = []
    var patterns = []
    var notes = []
    var firstNote
    var lastNote

    midi.tracks.forEach((arr, index) => {
      if (arr[0].text !== undefined) {

        // load guitar tracks
        if (arr[0].text.includes("FMP -") && arr[0].text !== "FMP - Jam Bar") {
          var track = noteTrack(arr, secondsForTicks)
          notes = notes.concat(track.notes)
          delete track.notes
          guitarTracks.push(track)
        }

        // load tuning tracks
        if (arr[0].text.includes("T -")) {
          var track = noteTrack(arr, secondsForTicks)
          tuningTracks.push(track)
        }

        // load jambar track
        if (arr[0].text.includes("FMP - Jam Bar")) {
          patterns = patternTrack(arr, secondsForTicks)
        }
      }
    })
  
    var beginnings = notes.sort((a, b) => {
      return a.begin - b.begin
    })
    var firstNote = beginnings[0]

    var endings = notes.sort((a, b) => {
      return b.end - a.end
    })
    var lastNote = endings[0]

    return { 
        markers: List(markers),
        guitarTracks: List(guitarTracks),
        tuningTracks: List(tuningTracks),
        patterns: List(patterns),
        notes: Set(notes)
      }
  })
}
