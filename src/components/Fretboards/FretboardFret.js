import React from "react";
import { View } from "react-native";
import FretboardNote from "./FretboardNote";

const background = { position: "absolute", width: "100%", height: "100%", backgroundColor: 'black' }
const bar = { position: "absolute", right: 0, width: 3, height: "100%", backgroundColor: '#CCCCCC' }

const noteViews = (fretIndex, isEmpty, isBass, notes) => {
  if (isEmpty === undefined) {
    var num = isBass ? 4 : 6
    var noteViews = []
    
    for (var i = 0; i <= num; i++) {
      const matching = notes.filter(note => note.string === i)
      noteViews.push(<FretboardNote key={i} index={i} isVisible={matching.count() > 0} />)
    }
    return noteViews
  }
}

const FretboardFret = ({ index, empty, isBass, notes, style }) => (
  <View style={{ ...style, flex: 1 }}>
    <View style={background} />
    <View style={bar} />
    <View style={{ flex: 1, justifyContent: "space-between", alignItems: "center", marginLeft: -3 }} >
      {noteViews(index, empty, isBass, notes)}
    </View>
  </View>
);

export default FretboardFret;
