import React from "react";
import { connect } from "react-redux";
import { View, Text } from "react-native";

import * as actions from "../../redux/actions";
import { getTrackNotesForTimeSelector, getTrackFretRangeSelector } from '../../selectors'

import FretboardFret from "./FretboardFret";

const fretsForRange = (range, style) => {
  var frets = [];
  var first = range !== undefined ? range.first : 0
  var last = range !== undefined ? range.last : 23
  
  for (var i = first; i <= last; i++) {
    frets.push(<FretboardFret key={i} index={i} style={{ height: style.height }} />)
  }
  return frets
}

const Fretboard = ({ style, track, range }) => (
  <View
    style={{
      ...style, backgroundColor: "#E6D9B9",
    }}
  >
    <Text style={{ height: 24 }} >{track.name}</Text>
    <View style={{ flex: 1, flexDirection: 'row', justifyContent: "space-between" }}>
      {fretsForRange(range, style)}
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
