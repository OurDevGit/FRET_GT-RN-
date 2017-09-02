import { createSelector } from "reselect";
import { List, Map, Set } from "immutable";
import MidiParser from "../midi-parser";

const getTimeSelector = state => state.get("time");
const getVisibleTracksSelector = state => state.get("visibleTracks");
const getLoopIsEnabledSelector = state => state.get("loopIsEnabled");
const getCurrentLoopSelector = state => state.get("currentLoop");
const getTrackNameSelector = (_, props) => props.track;
const getFretSelector = (_, props) => props.fret;
const getStringSelector = (_, props) => props.string;
const getTempoSelector = (_, props) => props.tempo;

var notes = Map();

exports.loadMidi = path => {
  return MidiParser(path).then(midi => {
    notes = Map(midi.notes);
    delete midi.notes;
    return midi;
  });
};

exports.clearMidi = () => {
  notes = Map();
};

exports.hasNoteForTimeSelector = createSelector(
  getTimeSelector,
  getTrackNameSelector,
  getFretSelector,
  getStringSelector,
  (time, track, fret, string) => {
    const notesForTrackFretString = notes.getIn([track, fret, string]);

    if (notesForTrackFretString !== undefined) {
      const notesForTrackFretStringAtTime = notesForTrackFretString.filter(
        note => {
          return note.get("begin") <= time && note.get("end") > time;
        }
      );
      return notesForTrackFretStringAtTime.count() > 0;
    } else {
      return false;
    }
  }
);

exports.timeForPrevStep = (time, track, currentLoop, loopIsEnabled) => {
  const trackMap = notes.get(track).flatten(2);
  var notesForTrack = Set();

  trackMap.forEach(note => {
    notesForTrack = notesForTrack.add(note);
  });

  var timesForTrack = notesForTrack.map(note => note.get("begin"));

  const filtered = timesForTrack.filter(noteTime => {
    return noteTime < time;
  });

  if (filtered.count() > 0) {
    const sorted = List(filtered).sort().reverse();
    const currentNotes = notesForTrack
      .filter(note => note.get("begin") <= time && note.get("end") > time)
      .map(note => Map({ fret: note.get("fret"), string: note.get("string") }));

    var newTime = 0;
    sorted.some(noteTime => {
      const nextNotes = notesForTrack
        .filter(
          note => note.get("begin") === noteTime && note.get("end") > noteTime
        )
        .map(note =>
          Map({ fret: note.get("fret"), string: note.get("string") })
        );

      if (!currentNotes.equals(nextNotes)) {
        newTime = noteTime;
        return true;
      }
    });

    return newTime;
  } else {
    const sorted = List(timesForTrack).sort();
    return sorted.last();
  }
};

exports.timeForNextStep = (time, track, currentLoop, loopIsEnabled) => {
  const trackMap = notes.get(track).flatten(2);
  var notesForTrack = Set();

  trackMap.forEach(note => {
    notesForTrack = notesForTrack.add(note);
  });

  var timesForTrack = notesForTrack.map(note => note.get("begin"));

  const filtered = timesForTrack.filter(noteTime => {
    return time === 0 ? noteTime >= 0 : noteTime > time;
  });

  if (filtered.count() > 0) {
    const sorted = List(filtered).sort();
    const currentNotes = notesForTrack
      .filter(note => note.get("begin") <= time && note.get("end") > time)
      .map(note => Map({ fret: note.get("fret"), string: note.get("string") }));

    var newTime = 0;
    sorted.some(noteTime => {
      const nextNotes = notesForTrack
        .filter(
          note => note.get("begin") === noteTime && note.get("end") > noteTime
        )
        .map(note =>
          Map({ fret: note.get("fret"), string: note.get("string") })
        );

      if (!currentNotes.equals(nextNotes)) {
        newTime = noteTime;
        return true;
      }
    });

    return newTime;
  } else {
    const sorted = List(timesForTrack).sort();
    return sorted.first();
  }
};
