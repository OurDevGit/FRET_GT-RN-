import React from "react";
import { View, Text } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import FretboardNote from "./FretboardNote";
import FretMarkers from "./FretboardMarkers";

const bar = { position: "absolute", right: 0, width: 4, height: "100%", backgroundColor: '#CCCCCC' }

const backgroundColor = fretIndex => {
  return fretIndex > 0 ? ["black", "black"] : ["#f2b172", "#f0b072", "#c29b74", "#8d7b68", "#4f4c48"]
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
      <LinearGradient 
        colors={backgroundColor(index)} 
        start={{ x: 0.1, y: 0.0 }}
        end={{ x: 0.9, y: 0.0 }}
        style={{ position: "absolute", width: "100%", height: "100%" }} 
      />
      <View style={bar} />
      <FretMarkers fretIndex={index}/>
      
      <View style={{ width: "100%", height: "100%", paddingVertical: 3, justifyContent: "space-between", alignItems: "center", marginLeft: -3 }} >
        {noteViews(index, track, isBass)}
      </View>
    </View>
    
  </View>
);

export default FretboardFret;
