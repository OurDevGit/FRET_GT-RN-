import { createSelector } from "reselect";
import { List, Map, Set } from "immutable";
import MidiParser from "../midi-parser";

const getTimeSelector = state => state.get("time");
const getTimeOffset = state => state.get("timeMidiOffset");
const getVisibleTracksSelector = state => state.get("visibleTracks");
const getLoopIsEnabledSelector = state => state.get("loopIsEnabled");
const getCurrentLoopSelector = state => state.get("currentLoop");
const getTrackNameSelector = (_, props) => props.track;
const getFretSelector = (_, props) => props.fret;
const getStringSelector = (_, props) => props.string;
const getTempoSelector = (_, props) => props.tempo;

var notes = Map();

exports.loadMidi = path => {
  return MidiParser(path)
    .then(midi => {
      notes = Map(midi.notes);
      delete midi.notes;
      return midi;
    })
    .catch(err => {
      // TODO: should probably handle this
    });
};

exports.clearMidi = () => {
  notes = Map();
};

exports.hasNoteForTimeSelector = createSelector(
  getTimeSelector,
  getTimeOffset,
  getTrackNameSelector,
  getFretSelector,
  getStringSelector,
  (time, offset, track, fret, string) => {
    const notesForTrackFretString = notes.getIn([track, fret, string]);
    const offsetTime = time - offset;

    if (notesForTrackFretString !== undefined) {
      const notesForTrackFretStringAtTime = notesForTrackFretString.filter(
        note => {
          return (
            note.get("begin") <= offsetTime && note.get("end") > offsetTime
          );
        }
      );
      return notesForTrackFretStringAtTime.count() > 0;
    } else {
      return false;
    }
  }
);

const timeForStep = (type, time, track, currentLoop, loopIsEnabled) => {
  const trackMap = notes.get(track).flatten(2);
  var notesForTrack = Set();

  trackMap.forEach(note => {
    notesForTrack = notesForTrack.add(note);
  });

  var timesForTrack = notesForTrack.map(note => note.get("begin"));

  timesForTrack = timesForTrack.filter(noteTime => {
    const begin = currentLoop.get("begin");
    const end = currentLoop.get("end");
    if (loopIsEnabled && begin !== undefined && end !== undefined) {
      return begin <= noteTime && end > noteTime;
    } else {
      return true;
    }
  });

  const filtered = timesForTrack.filter(noteTime => {
    return type === "PREV"
      ? noteTime < time
      : time === 0 ? noteTime >= 0 : noteTime > time;
  });

  if (filtered.count() > 0) {
    const sorted =
      type === "PREV"
        ? List(filtered)
            .sort()
            .reverse()
        : List(filtered).sort();

    const currentNotes = notesForTrack
      .filter(note => note.get("begin") <= time && note.get("end") > time)
      .map(note => Map({ fret: note.get("fret"), string: note.get("string") }));

    var newTime = -1;
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

    if (newTime > -1) {
      return newTime;
    }
  }
  const sorted = List(timesForTrack).sort();
  return type === "PREV" ? sorted.last() : sorted.first();
};

exports.timeForPrevStep = (time, track, currentLoop, loopIsEnabled) => {
  return timeForStep("PREV", time, track, currentLoop, loopIsEnabled);
};

exports.timeForNextStep = (time, track, currentLoop, loopIsEnabled) => {
  return timeForStep("NEXT", time, track, currentLoop, loopIsEnabled);
};
