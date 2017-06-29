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
    console.log("updating fret")
    const notesForTrack = notes.getIn([track]).flatten(2)
    //console.log("notesForTrack: ", notesForTrack.toJS())
    if (notesForTrack.count() === 0) {
      return { first: 0, last: 23}
    } else {
      
      const frets = notesForTrack.map(note => {
        return note.fret
      }).sort((a, b) => {
        return a - b
      })
      //console.log(`first: ${frets.first()}; last: ${frets.last()}`)
      return { first: frets.first(), last: frets.last()}
    }
  }
);

exports.hasNoteForTimeSelector = createSelector(
  getTimeSelector, getTrackNameSelector, getFretSelector, getStringSelector,
  (time, track, fret, string) => {
    //console.log(notes.toJS)
    /*
    const notesForTrackFretString = notes.getIn([track, fret, string])
    //console.log("notesForTrackFretString: ", notesForTrackFretString)
    const notesForTrackFretStringAtTime = notesForTrackFretString.filter(note => {
      return note.begin <= time && note.end > time
    })

    return notesForTrackFretStringAtTime.count() > 0*/
    return false
  }
);
