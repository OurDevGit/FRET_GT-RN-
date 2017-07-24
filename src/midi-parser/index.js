import RNFetchBlob from "react-native-fetch-blob";
import { decode } from "base-64";
import midiFileParser from "midi-file-parser";
import { Map, List } from "immutable";

import timingTrack from "./timing-track";
import noteTrack from "./note-track";
import patternTrack from "./pattern-track";

module.exports = filename => {
  const path = RNFetchBlob.fs.asset(filename);
  return RNFetchBlob.fs.readFile(path, "base64").then(data => {
    var binary = decode(data);
    var midi = midiFileParser(binary);
    var { markers, secondsForTicks } = timingTrack(midi.tracks[0], midi.header);

    var guitarTracks = List();
    var tuningTracks = List();
    var patterns = List();
    var notes = Map();

    midi.tracks.forEach((arr, index) => {
      if (arr[0].text !== undefined) {
        // load guitar tracks
        if (arr[0].text.includes("FMP -") && arr[0].text !== "FMP - Jam Bar") {
          var track = noteTrack(arr, secondsForTicks);
          notes = notes.set(track.name, track.notes);
          delete track.notes;
          guitarTracks = guitarTracks.push(track);
        }

        // load tuning tracks
        if (arr[0].text.includes("T -")) {
          var track = noteTrack(arr, secondsForTicks);
          tuningTracks = tuningTracks.push(track);
        }

        // load jambar track
        if (arr[0].text.includes("FMP - Jam Bar")) {
          patterns = List(patternTrack(arr, secondsForTicks));
        }
      }
    });

    return {
      markers,
      guitarTracks,
      tuningTracks,
      patterns,
      notes
    };
  });
};
