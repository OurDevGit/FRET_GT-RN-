import React from "react";
import { connect } from "react-redux";
import { View, Text } from "react-native";

import * as actions from "../../redux/actions";
import { getTrackNotesForTimeSelector, getTrackFretRangeSelector } from '../../selectors'

import FretboardFret from "./FretboardFret";

const fretsForRange = (track, range, notes, style) => {
  var frets = [];
  var first = 0 // range !== undefined ? range.first : 0  // save for SMART Fretboards
  var last = 23 // range !== undefined ? range.last : 23  // save for SMART Fretboards
  
  for (var i = first; i <= last; i++) {
    const fretNotes = notes.filter(note => note.fret === i)
    frets.push(
    <FretboardFret
      key={i}
      index={i}
      isBass={track.isBass}
      notes={fretNotes}
      style={{ height: style.height }}
    />)
  }
  return frets
}

const Fretboard = ({ style, track, range, notes }) => (
  <View
    style={{
      ...style, backgroundColor: "#E6D9B9",
    }}
  >
    <Text style={{ height: 24 }} >{track.name}</Text>
    <View style={{ flex: 1, flexDirection: 'row', justifyContent: "space-between" }}>
      {fretsForRange(track, range, notes, style)}
    </View>
  </View>
);

const mapStateToProps = (state, props) => {
  return {
    notes: getTrackNotesForTimeSelector(state, props),
    range: getTrackFretRangeSelector(state, props)
  };
};

export default connect(mapStateToProps, actions)(Fretboard);
