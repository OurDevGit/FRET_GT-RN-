import { createSelector } from 'reselect'
import { Map } from 'immutable'
import MidiParser from "../midi-parser";

const getTimeSelector = state => state.get("time")
const getTrackNameSelector = (_, props) => props.track.name
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

exports.getTrackFretRangeSelector = createSelector(
  getTrackNameSelector,
  (track) => {

    const notesForTrack = notes[track].flatten(2)
    
    if (notesForTrack.count() === 0) {
      return { first: 0, last: 23}
    } else {
      
      const frets = notesForTrack.map(note => {
        return note.fret
      }).sort((a, b) => {
        return a - b
      })
      
      return { first: frets.first(), last: frets.last()}
    }
  }
);

exports.hasNoteForTimeSelector = createSelector(
  getTimeSelector, getTrackNameSelector, getFretSelector, getStringSelector,
  (time, track, fret, string) => {
    const notesForTrackFretString = notes[track][fret][string]

    const notesForTrackFretStringAtTime = notesForTrackFretString.filter(note => {
      return note.begin <= time && note.end > time
    })

    return notesForTrackFretStringAtTime.count() > 0
  }
);
