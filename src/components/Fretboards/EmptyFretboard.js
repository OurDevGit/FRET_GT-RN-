import React from "react";
import { View, Text } from "react-native";
import FretboardFret from "./FretboardFret";

const fretsForRange = style => {
  var frets = [];
  for (var i = 0; i <= 23; i++) {
    frets.push(<FretboardFret key={i} index={i} style={{ flex: 1 }} />)
  }
  return frets
}

const EmptyFretboard = ({ style, onLayout }) => (
  <View
    style={{
      flex: 1, backgroundColor: "#E6D9B9",
    }}
  >
    <Text style={{ height: 24 }} />
    <View style={{ flex: 1, flexDirection: 'row', justifyContent: "space-between" }}>
      {fretsForRange(style)}
    </View>
  </View>
);

export default EmptyFretboard;