import React, {Component} from "react";
import { connect } from "react-redux";
import { View, Text } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import FretMarkers from "./FretboardMarkers";

const frets = (style, track) => {
  var frets = [];
  var first = 0 // track.firstFret : 0  // save for SMART Fretboards
  var last = 23 // track.lastFret : 23  // save for SMART Fretboards
  
  for (var i = first; i <= last; i++) {
    frets.push(
    <View key={i} style={{  flex: 1 }}>
      <Text style={{ width: "100%", height: 12, fontSize: 10, marginBottom: 4, textAlign: "center", backgroundColor: "#E6D9B9" }} >{i > 0 ? i : "Nut"}</Text>
      <View style={{ flex: 1, backgroundColor: "black"}}>
        {i === 0 &&
          <LinearGradient 
            colors={["#f2b172", "#f0b072", "#c29b74", "#8d7b68", "#4f4c48"]} 
            start={{ x: 0.1, y: 0.0 }}
            end={{ x: 0.9, y: 0.0 }}
            style={{ position: "absolute", width: "100%", height: "100%" }} 
          />}
        
        <View style={{ position: "absolute", right: 0, width: 4, height: "100%", backgroundColor: '#CCCCCC' }} />
        <FretMarkers fret={i}/>
      </View>
    </View>)
  }
  return frets
}

const FretboardFretBackground = ({ style, track }) => (
  <View style={{ position: "absolute", top: 25, left: 10, width: "100%", height: "88%", flexDirection: 'row', justifyContent: "space-between" }}>
    {frets(style, track)}
  </View>
  
);

export default FretboardFretBackground;