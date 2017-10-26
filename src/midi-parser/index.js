import RNFetchBlob from "react-native-fetch-blob";
import { decode } from "base-64";
import midiFileParser from "midi-file-parser";
import { Map, List, Set } from "immutable";

import timingTrack from "./timing-track";
import noteTrack from "./note-track";
import patternTrack from "./pattern-track";

module.exports = (filename, isAsset = false) => {
  const path = isAsset === true ? RNFetchBlob.fs.asset(filename) : filename;
  return RNFetchBlob.fs
    .readFile(path, "base64")
    .then(data => {
      var binary = decode(data);
      var midi = midiFileParser(binary);
      var { markers, secondsForTicks } = timingTrack(
        midi.tracks[0],
        midi.header
      );

      var guitarTracks = List();
      var tuningTracks = List();
      var patterns = List();
      var notes = Map();

      midi.tracks.forEach((arr, index) => {
        if (arr[0].text !== undefined) {
          // load guitar tracks
          if (
            arr[0].text.includes("FMP -") &&
            arr[0].text !== "FMP - Jam Bar"
          ) {
            var track = noteTrack(arr, secondsForTicks);
            const trackName = track.get("name");
            const trackNotes = track.get("notes");
            const loadedTrackNotes = notes.get(trackName);

            if (loadedTrackNotes === undefined) {
              notes = notes.set(trackName, trackNotes);
            } else {
              const combined = loadedTrackNotes.concat(trackNotes);
              notes = notes.set(trackName, combined);
            }

            track = track.delete("notes");

            // check to see if a track with the same name has been added
            // (video has multiple tracks with same name)
            const index = guitarTracks.findIndex(
              guitarTrack => guitarTrack.get("name") === track.get("name")
            );

            if (index === -1) {
              guitarTracks = guitarTracks.push(track);
            } else {
              const existing = guitarTracks.get(index);
              const firstFret = Math.min(existing.firstFret, track.firstFret);
              const lastFret = Math.max(existing.lastFret, track.lastFret);
              const combined = existing
                .set("firstFret", firstFret)
                .set("lastFret", lastFret);
              guitarTracks = guitarTracks.set(index, combined);
            }
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
    })
    .catch(err => {
      console.debug("error loading midi...");
      console.error(err);
    });
};
