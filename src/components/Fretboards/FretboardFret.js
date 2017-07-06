import React from "react";
import { View } from "react-native";
import FretboardNote from "./FretboardNote";

const background = { position: "absolute", width: "100%", height: "100%", backgroundColor: 'black' }
const bar = { position: "absolute", right: 0, width: 3, height: "100%", backgroundColor: '#CCCCCC' }

const noteViews = (fretIndex,  track, isBass) => {
  if (track !== undefined) {
    var num = isBass ? 4 : 6
    var noteViews = []
    
    for (var i = 0; i <= num; i++) {
      noteViews.push(<FretboardNote key={i} track={track} fret={fretIndex} string={i} />)
    }
    return noteViews
  }
}

const FretboardFret = ({ index, track, isBass, style }) => (
  <View style={{ ...style, flex: 1 }}>
    <View style={background} />
    <View style={bar} />
    <View style={{ flex: 1, paddingVertical: 10, justifyContent: "space-between", alignItems: "center", marginLeft: -3 }} >
      {noteViews(index, track, isBass)}
    </View>
  </View>
);

export default FretboardFret;
