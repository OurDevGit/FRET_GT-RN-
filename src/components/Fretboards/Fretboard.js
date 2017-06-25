import React from "react";
import { connect } from "react-redux";
import { View, Image } from "react-native";

import * as actions from "../../redux/actions";
import { getTrackNotesForTimeSelector, getTrackFretRangeSelector } from '../../selectors'

import FretboardFret from "./FretboardFret";

const fretsForRange = range => {
  var frets = [];
  var first = range !== undefined ? range.first : 0
  var last = range !== undefined ? range.last : 23
  
  for (var i = first; i <= last; i++) {
    frets.push(<FretboardFret key={i} index={i} />)
  }
  return frets
}

const Fretboard = ({ track, range }) => (
  <View
    style={{
      overflow: "hidden",
      flexGrow: 1,
      backgroundColor: "#FF0000"
    }}
  >
    <View style={{ flex: 1, flexDirection: 'row', justifyContent: "space-between" }}>
      {fretsForRange(range)}
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
