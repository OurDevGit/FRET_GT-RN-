import React from "react";
import { View, Text } from "react-native";
import FretboardNote from "./FretboardNote";


const bar = { position: "absolute", right: 0, width: 4, height: "100%", backgroundColor: '#CCCCCC' }

const backgroundStyle = fretIndex => {
  if (fretIndex === 0) {
    return { position: "absolute", width: "100%", height: "100%", backgroundColor: "#b17c2f" }
  } else {
    return { position: "absolute", width: "100%", height: "100%", backgroundColor: 'black' }
  }
}

const fretName = index => {
  return index === 0 ? "Nut" : index
}

const noteViews = (fretIndex,  track, isBass) => {
  var num = isBass ? 4 : 6
  var views = []
  var stringWidth = isBass ? 2 : 1
  for (var i = 0; i < num; i++) {
    var stringIndex = isBass ? i + 2 : i
    views.push(<FretboardNote key={i} track={track} fret={fretIndex} string={stringIndex} stringWidth={stringWidth} />)
  }
  return views
}

const FretboardFret = ({ index, track, isBass, style }) => (
  <View style={{ ...style, flex: 1 }}>
    <Text style={{ width: "100%", height: 12, fontSize: 10, marginBottom: 4, textAlign: "center", backgroundColor: "#E6D9B9" }} >{fretName(index)}</Text>
    <View style={{ flex: 1}}>
      <View style={backgroundStyle(index)} />
      <View style={bar} />
      
      <View style={{ width: "100%", height: "100%", paddingVertical: 3, justifyContent: "space-between", alignItems: "center", marginLeft: -3 }} >
        {noteViews(index, track, isBass)}
      </View>
    </View>
    
  </View>
);

export default FretboardFret;
