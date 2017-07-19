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
      return first + (matchingBelow.length + 1)
    } else if (matchingAbove.length > 1) {
      return first + "1"
    } else {
      return first
    }
  } else {
    return first
  }
}

const buttonsForMarkers = (left, width, duration, markers, onMarkerPress) => {
  var operationalWidth = width - (left * 2)
  abbreviations = markers.map(marker => marker.name.charAt(0))
  
  var buttons = markers.map((marker, index) => {
    var percent = marker.time / duration
    var x = left - 15 + (operationalWidth * percent)
    return (
    <TouchableOpacity key={marker.name} style={{ position: "absolute", top: 0, left: x, width: 30, alignItems: "center" }} onPress={() => { onMarkerPress(marker)}} >
      <View style={{ width: 2, height: 10, backgroundColor: PrimaryBlue }}/>
      <Text style={{ fontSize: 14 }}>{abbreviation(marker.name, index)}</Text>
    </TouchableOpacity>)
  })

  return buttons
}

const PlaybackMarkers = ({ left, width, height, duration, markers, onMarkerPress }) => (
  <View style={{ position: "absolute", top: 10, left: 0, width: width, height: height + 10 }} >
    {buttonsForMarkers(left, width, duration, markers, onMarkerPress)}
  </View>
);

export default PlaybackMarkers;