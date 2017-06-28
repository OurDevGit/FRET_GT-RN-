import React from "react";
import { connect } from "react-redux";
import { View, Text } from "react-native";

import * as actions from "../../redux/actions";
import { getTrackFretRangeSelector } from '../../selectors'

import FretboardFret from "./FretboardFret";

const fretsForRange = (track, range, style) => {
  var frets = [];
  var first = 0 // range !== undefined ? range.first : 0  // save for SMART Fretboards
  var last = 23 // range !== undefined ? range.last : 23  // save for SMART Fretboards
  
  for (var i = first; i <= last; i++) {
    frets.push(
    <FretboardFret
      key={i}
      index={i}
      track={track.name}
      isBass={track.isBass}
      style={{ height: style.height }}
    />)
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
      {fretsForRange(track, range, style)}
    </View>
  </View>
);

const mapStateToProps = (state, props) => {
  return {
    range: getTrackFretRangeSelector(state, props)
  };
};

export default connect(mapStateToProps, actions)(Fretboard);
