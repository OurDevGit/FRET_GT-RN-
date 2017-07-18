import { createSelector } from 'reselect'
import { Map, Set } from 'immutable'
import MidiParser from "../midi-parser";

const getTrackNameSelector = (_, props) => props.track
const getFretSelector = (_, props) => props.fret
const getStringSelector = (_, props) => props.string
var notes = Map()

exports.loadMidi = (path) => {
  return MidiParser(path)
  .then(midi => {
    notes = Map(midi.notes);
    delete midi.notes;
    return midi;
  })
};

exports.notesForTrack = createSelector(
  getTrackNameSelector, getFretSelector, getStringSelector,
  (track) => {
    return notes.getIn([track, fret, string]) || Set()
  }
);

