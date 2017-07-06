import React from "react";
import { connect } from "react-redux";
import { View, Text } from "react-native";

import * as actions from "../../redux/actions";
import FretboardFret from "./FretboardFret";

const boardName = track => {
  return track === undefined ? " " : track.name
}

const fretsForRange = (style, track) => {
  var frets = [];
  var first = 0 // track.firstFret : 0  // save for SMART Fretboards
  var last = 23 // track.lastFret : 23  // save for SMART Fretboards
  var trackName
  var isBass = false

  if (track !== undefined) {
    trackName = track.name
    isBass = track.isBass
  }
  
  for (var i = first; i <= last; i++) {
    frets.push(
    <FretboardFret
      key={i}
      index={i}
      track={trackName}
      isBass={isBass}
      style={{ flex: 1 }}
    />)
  }
  return frets
}

const Fretboard = ({ style, track }) => (
  <View
    style={{
      ...style, 
      paddingTop: 10, 
      paddingRight: 10, 
      paddingBottom: 20,
      paddingLeft: 10, 
      backgroundColor: "#E6D9B9",
    }}
  >
    <Text style={{ height: 20, marginTop: -2 }} >{boardName(track)}</Text>
    <View style={{ flex: 1, flexDirection: 'row', justifyContent: "space-between" }}>
      {fretsForRange(style, track)}
    </View>
  </View>
);

// keep connect since we will need buttons for SMART and Tuner
export default connect(undefined, actions)(Fretboard);
