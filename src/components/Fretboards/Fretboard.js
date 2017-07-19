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
      track={trackName}
      isBass={isBass}
      fret={i}
      style={{ flex: 1 }}
    />)
  }
  return frets
}

const strings = (track) => {
  var views = []
  var isBass = false

  if (track !== undefined) {
    isBass = track.isBass
  }

  var count = isBass ? 4 : 6
  var stringWidth = isBass ? 2 : 1
  
  for (var i = 0; i < count; i++) {
    views.push(
    <View key={i} style={{ flex: 1, alignItems: "center" }}>
      <View
        style={{
          position: "absolute",
          top: 7 + stringWidth,
          left: 0,
          width: "100%",
          height: stringWidth,
          backgroundColor: "#222222"
        }}
      />

      <View
        style={{
          position: "absolute",
          top: 7,
          left: 0,
          width: "100%",
          height: stringWidth,
          backgroundColor: "#CCCCCC"
        }}
      />
    </View>)
  }

  return views
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
    <View style={{ position: "absolute", top: 25, left: 10, width: "100%", height: "88%", flexDirection: 'row', justifyContent: "space-between" }}>
      {fretsForRange(style, track)}
    </View>
    
    <View style={{ position: "absolute", top: 40, left: 10, width: "100%", height: "78%", flexDirection: 'column', justifyContent: "space-between", paddingVertical: 3 }}>
      {strings(track)}
    </View>
  </View>
);

// keep connect since we will need buttons for SMART and Tuner
export default connect(undefined, actions)(Fretboard);
