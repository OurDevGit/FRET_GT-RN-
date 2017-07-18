import { createSelector } from 'reselect'
import { Map } from 'immutable'
import MidiParser from "../midi-parser";

const getTrackNameSelector = (_, props) => props.track
const getFretSelector = (_, props) => props.fret

var notes = Map()

exports.loadMidi = (path) => {
  return MidiParser(path)
  .then(midi => {
    notes = Map(midi.notes);
    delete midi.notes;
    return midi;
  })
};

exports.notesForTrackAtFret = createSelector(
  getTrackNameSelector, getFretSelector,
  (track, fret) => {
    return notes.getIn([track, fret]) || Map()
  }
);

