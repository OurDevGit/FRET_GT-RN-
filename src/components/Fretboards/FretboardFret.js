import React, {Component} from "react";
import { connect } from "react-redux";
import { View, Text } from "react-native";
import LinearGradient from 'react-native-linear-gradient';

import FretboardNote from "./FretboardNote";
import FretMarkers from "./FretboardMarkers";

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

const FretboardFret = ({ track, fret, isBass, style }) => (
  <View style={{ ...style, flex: 1 }}>
    <Text style={{ width: "100%", height: 12, fontSize: 10, marginBottom: 4, textAlign: "center", backgroundColor: "#E6D9B9" }} >{fret > 0 ? fret : "Nut"}</Text>
    <View style={{ flex: 1, backgroundColor: "black"}}>
      {fret === 0 &&
        <LinearGradient 
          colors={["#f2b172", "#f0b072", "#c29b74", "#8d7b68", "#4f4c48"]} 
          start={{ x: 0.1, y: 0.0 }}
          end={{ x: 0.9, y: 0.0 }}
          style={{ position: "absolute", width: "100%", height: "100%" }} 
        />}
      
      <View style={{ position: "absolute", right: 0, width: 4, height: "100%", backgroundColor: '#CCCCCC' }} />
      <FretMarkers fret={fret}/>

      <View style={{ width: "100%", height: "100%", paddingVertical: 3, justifyContent: "space-between", alignItems: "center", marginLeft: -3 }} >
        <FretboardNote key={0} track={track} fret={fret} string={0} notation={notation(fret, 0)}/>
        <FretboardNote key={1} track={track} fret={fret} string={1} notation={notation(fret, 1)}/>
        <FretboardNote key={2} track={track} fret={fret} string={2} notation={notation(fret, 2)}/>
        <FretboardNote key={3} track={track} fret={fret} string={3} notation={notation(fret, 3)}/>

        {!isBass &&  <FretboardNote key={4} track={track} fret={fret} string={4} notation={notation(fret, 4)} />}
        {!isBass &&  <FretboardNote key={5} track={track} fret={fret} string={5} notation={notation(fret, 5)}/>}
      </View>
    </View>
    
  </View>
);

export default FretboardFret;
