import React from "react";
import { connect } from "react-redux";
import { View, Image } from "react-native";

import * as actions from "../../redux/actions";
import { getTrackNotesForTimeSelector, getTrackFretRangeSelector } from '../../selectors'

import FretboardFret from "./FretboardFret";

const fretsForRange = range => {
  var frets = [];
  for (var i = range.first; i <= range.last; i++) {
    frets.push(<FretboardFret key={i} index={i} />)
  }
  return frets
}

const Fretboard = ({ track, range }) => (
  <View
    style={{
      overflow: "hidden",
      flexGrow: 1
    }}
  >
    <View style={{ top: 23, left: 0, marginRight: 8, marginLeft: 8, flex: 1, flexDirection: 'row', justifyContent: "space-between" }}>
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
