import { createSelector } from "reselect";
import { Map } from "immutable";
import MidiParser from "../midi-parser";

const getTimeSelector = state => state.get("time");
const getTrackNameSelector = (_, props) => props.track;
const getFretSelector = (_, props) => props.fret;
const getStringSelector = (_, props) => props.string;

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
