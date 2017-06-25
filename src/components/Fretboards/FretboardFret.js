import React from "react";
import { View } from "react-native";
import FretboardNote from "./FretboardNote";

const background = { position: "absolute", width: "100%", height: "100%", backgroundColor: 'black' }
const bar = { position: "absolute", right: 0, width: 3, height: "100%", backgroundColor: '#CCCCCC' }

const notes = isBass => {
  var num = isBass ? 4 : 6
  var arr = []
  for (var i = 0; i <= num; i++) {
    arr.push(<FretboardNote key={i} index={i} />)
  }
  return arr
}

const FretboardFret = ({ style }) => (
  <View style={{ ...style, flex: 1 }}>
    <View style={background} />
    <View style={bar} />
    <View
      style={{ marginLeft: "-10%", flex: 1, flexDirection: "column", justifyContent: "space-between", alignItems: "center" }}
    >
      {notes(false)}
    </View>
  </View>
);

export default FretboardFret;
