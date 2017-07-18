import React from "react";
import { View, Button, Text, TouchableOpacity } from "react-native";
import { PrimaryBlue } from "../../design"

const buttonStyle = { width: 40, aspectRatio: 1, marginHorizontal: 5, color: PrimaryBlue, fontSize: 14, textAlign: "center" }
var abbreviations = []

const abbreviation = (markerName, index) => {
  var first = markerName.charAt(0)
            
  if (index < abbreviations.length) {
      let matchingBelow = abbreviations.slice(0, index).filter(name => name === first)
      let matchingAbove = abbreviations.slice(index, abbreviations.length).filter(name => name === first)
      
      if (matchingBelow.length > 0) {
          return name + matchingBelow.length + 1
      } else if (matchingAbove.length > 1) {
          return name + "1"
      }
  } else {
    return first
  }
}

const buttonsForMarkers = (duration, markers, onMarkerPress) => {
  var buttons = [];

  for (var i = 0; i < markers.length; i++) {
    var marker = markers[i]
    var x = (marker.time / duration) - 20
    console.log(marker.name, marker.time, duration, x)
    buttons.push(
    <TouchableOpacity key={marker.name} style={{ position: "absolute", top: 0, left: x, width: 40, alignItems: "center", backgroundColor: "#CCC" }} onPress={() => { onMarkerPress(marker)}} >
      <View style={{ width: 2, height: 10, backgroundColor: PrimaryBlue }}/>
      <Text style={{ fontSize: 14 }}>{abbreviation(marker.name, i)}</Text>
    </TouchableOpacity>)
  }

  // console.log(buttons)
  return buttons
}

const PlaybackMarkers = ({ duration, markers, onMarkerPress }) => (
  <View style={{ flex: 1, flexDirection: "row", marginTop: 10 }} >
    {buttonsForMarkers(duration, markers, onMarkerPress)}
  </View>
);

export default PlaybackMarkers;