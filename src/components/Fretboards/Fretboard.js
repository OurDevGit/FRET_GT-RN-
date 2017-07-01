import React from "react";
import { connect } from "react-redux";
import { View, Text } from "react-native";

import * as actions from "../../redux/actions";
import FretboardFret from "./FretboardFret";

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
      style={{ height: style.height }}
    />)
  }
  return frets
}

const Fretboard = ({ style, track }) => (
  <View
    style={{
      ...style, backgroundColor: "#E6D9B9",
    }}
  >
    {track !== undefined ?
      <Text style={{ height: 24 }} >{track.name}</Text>
    : <Text style={{ height: 24 }} > </Text>
    }
    
    <View style={{ flex: 1, flexDirection: 'row', justifyContent: "space-between" }}>
      {fretsForRange(style, track)}
    </View>
  </View>
);

// keep connect since we will need buttons for SMART and Tuner
export default connect(undefined, actions)(Fretboard);
