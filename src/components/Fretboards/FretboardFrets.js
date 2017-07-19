import React, {Component} from "react";
import { connect } from "react-redux";
import { View, Text } from "react-native";
import FretboardNote from "./FretboardNote";

// TODO: IMPLEMENT TUNING ADJUSTMENT AND NOTATION SETTINGS

const scaleForNotation = notation => {
  switch (notation) {
    case "sharps":
      return ["E", "F", "F♯", "G", "G♯", "A", "A♯", "B", "C", "C♯", "D", "D♯"]
    default:
      return ["E", "F", "G♭", "G", "A♭", "A", "B♭", "B", "C", "D♭", "D", "E♭"]
  }
}

const notation = (fret, string) => {
  const roots = ["E", "B", "G", "D", "A", "E"]
  const defaultName = roots[string]
  const scale = scaleForNotation()
  const index = scale.indexOf(defaultName) || 0
  const adjusted = fret + index// + adjustment
  var remainder = adjusted % scale.length

  if (remainder < 0) {
      remainder = scale.count + remainder
  }
  
  return scale[remainder]
}

const frets = (style, track) => {
  var frets = [];
  var first = 0 // track.firstFret : 0  // save for SMART Fretboards
  var last = 23 // track.lastFret : 23  // save for SMART Fretboards
  
  for (var i = first; i <= last; i++) {
    frets.push(
    <View key={i} style={{ flex: 1 }}>
      <View style={{ flex: 1}}>
        <View style={{ width: "100%", height: "100%", paddingVertical: 3, justifyContent: "space-between", alignItems: "center", marginLeft: -3 }} >
          <FretboardNote key={0} track={track.name} fret={i} string={track.isBass ? 2 : 0} notation={notation(i, 0)}/>
          <FretboardNote key={1} track={track.name} fret={i} string={track.isBass ? 3 : 1} notation={notation(i, 1)}/>
          <FretboardNote key={2} track={track.name} fret={i} string={track.isBass ? 4 : 2} notation={notation(i, 2)}/>
          <FretboardNote key={3} track={track.name} fret={i} string={track.isBass ? 5 : 3} notation={notation(i, 3)}/>

          {!track.isBass &&  <FretboardNote key={4} track={track.name} fret={i} string={4} notation={notation(i, 4)} />}
          {!track.isBass &&  <FretboardNote key={5} track={track.name} fret={i} string={5} notation={notation(i, 5)}/>}
        </View>
      </View>
      
    </View>)
  }
  return frets
}

const FretboardFrets = ({ style, track }) => (
  <View style={{ position: "absolute", top: track.isBass ? 45 : 42, left: 10, width: "100%", height: "77%", flexDirection: 'row', justifyContent: "space-between" }}>
    {frets(style, track)}
  </View>
);

export default FretboardFrets;
