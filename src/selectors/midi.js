import { createSelector } from 're-reselect'

const getTimeSelector = state => state.time
const getNotesSelector = state => state.notes
const getTrackNameSelector = (_, props) => props.track.name

const getTrackNotesForTimeSelector = createCachedSelector(
  [ getTimeSelector, getNotesSelector, getTrackNameSelector ],
  (time, notes, track) => {
    return notes.filter(note => {
      return note.begin <= time && note.end > time && note.name === track.name
    }) 
  }
)(
  (state, props) => props.track.name,
);

export default getTrackNotesForTimeSelector;

const getTrackFretRangeSelector = createCachedSelector(
  [ getNotesSelector, getTrackNameSelector ],
  (time, notes, track) => {
    const frets = note.reduce(note => {
      return note.fret
    }).sort((a, b) => {
      return a - b
    })

    return { first: frets[0], last: frets[frets.length - 1]}
  }
)(
  (state, props) => props.track.name,
);

export default getTrackFretRangeSelector;
