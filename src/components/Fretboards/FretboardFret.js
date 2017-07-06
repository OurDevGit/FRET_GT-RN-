import React from "react";
import { View, Text } from "react-native";
import FretboardString from "./FretboardString";
import FretboardNote from "./FretboardNote";

const background = { position: "absolute", width: "100%", height: "100%", backgroundColor: 'black' }
const bar = { position: "absolute", right: 0, width: 3, height: "100%", backgroundColor: '#CCCCCC' }

const fretName = index => {
  return index === 0 ? "Nut" : index
}

const stringViews = isBass => {
  var num = isBass ? 4 : 6
  var views = []
  
  for (var i = 0; i <= num; i++) {
    views.push(<FretboardString key={i} isBass={isBass} />)
  }
  return views
}

const noteViews = (fretIndex,  track, isBass) => {
  if (track !== undefined) {
    var num = isBass ? 4 : 6
    var views = []
    
    for (var i = 0; i <= num; i++) {
      views.push(<FretboardNote key={i} track={track} fret={fretIndex} string={i} />)
    }
    return views
  }
}

const FretboardFret = ({ index, track, isBass, style }) => (
  <View style={{ ...style, flex: 1 }}>
    <Text style={{ width: "100%", height: 12, fontSize: 10, marginBottom: 4, textAlign: "center", backgroundColor: "#E6D9B9" }} >{fretName(index)}</Text>
    <View style={{ flex: 1}}>
      <View style={background} />
      <View style={bar} />

      <View style={{ position: "absolute", width: "100%", height: "100%", paddingVertical: 10, justifyContent: "space-between", alignItems: "center", marginLeft: -3 }} >
        {stringViews(isBass)}
      </View>
      
      <View style={{ position: "absolute", width: "100%", height: "100%", paddingVertical: 10, justifyContent: "space-between", alignItems: "center", marginLeft: -3 }} >
        {noteViews(index, track, isBass)}
      </View>
    </View>
    
  </View>
);

export default FretboardFret;
