import createCachedSelector from 're-reselect'

const getTimeSelector = state => state.get("time")
const getNotesSelector = state => state.get("notes")
const getTrackNameSelector = (_, props) => props.track.name

exports.getTrackNotesForTimeSelector = createCachedSelector(
  [ getTimeSelector, getNotesSelector, getTrackNameSelector ],
  (time, notes, track) => {
    return notes.filter(note => {
      return note.begin <= time && note.end > time && note.name === track.name
    })
  }
)(
  (state, props) => props.track.name,
);

exports.getTrackFretRangeSelector = createCachedSelector(
  [ getNotesSelector, getTrackNameSelector ],
  (notes, track) => {
    
    if (notes.count() === 0) {
      return { first: 0, last: 23}
    } else {
      
      const frets = notes.map(note => {
        return note.fret
      }).sort((a, b) => {
        return a - b
      })
      
      return { first: frets.first(), last: frets.last()}
    }
  }
)(
  (state, props) => props.track.name,
);
