import React, {Component} from "react";
import { View } from "react-native";

const strings = (track) => {
  var views = []
  var count = track.isBass ? 4 : 6
  var stringWidth = track.isBass ? 2 : 1
  
  for (var i = 0; i < count; i++) {
    views.push(
      <View key={i} style={{ flex: 1, alignItems: "center", marginTop: track.isBass ? 2 : 0 }}>
        <View
          style={{
            position: "absolute",
            top: 7 + stringWidth,
            left: 0,
            width: "100%",
            height: stringWidth,
            backgroundColor: "#222222"
          }}
        />

        <View
          style={{
            position: "absolute",
            top: 7,
            left: 0,
            width: "100%",
            height: stringWidth,
            backgroundColor: "#CCCCCC"
          }}
        />
      </View>)
  }

  return views
}

const FretboardStrings = ({ track }) => (
  <View style={{ position: "absolute", top: 42, left: 10, width: "100%", height: "77%", flexDirection: 'column', justifyContent: "space-between", paddingVertical: 3 }}>
    {strings(track)}
  </View>
);

export default FretboardStrings;