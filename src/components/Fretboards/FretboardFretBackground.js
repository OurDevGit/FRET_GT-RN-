import React, { Component } from "react";
import { connect } from "react-redux";
import { View } from "react-native";
import FretMarkers from "./FretboardMarkers";

const frets = (track, isSmart, boardWidth) => {
  var frets = [];
  var first = isSmart ? track.firstFret : 0;
  var last = isSmart ? track.lastFret : 23;

  for (var i = first; i <= last; i++) {
    frets.push(
      <View key={i} style={{ flex: 1 }}>
        <View
          style={{ flex: 1, backgroundColor: i === 0 ? "#f0b072" : "black" }}
        >
          <View
            style={{
              position: "absolute",
              right: 0,
              width: boardWidth * 0.004,
              height: "100%",
              backgroundColor: "#CCCCCC"
            }}
          />
          <FretMarkers fret={i} />
        </View>
      </View>
    );
  }
  return frets;
};

const FretboardFretBackground = ({ track, isSmart, boardWidth }) => (
  <View
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      flexDirection: "row",
      justifyContent: "space-between"
    }}
  >
    {frets(track, isSmart, boardWidth)}
  </View>
);

export default FretboardFretBackground;
