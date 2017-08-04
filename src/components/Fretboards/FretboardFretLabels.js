import React, { Component } from "react";
import { View, Text } from "react-native";

const labels = (style, track, boardWidth) => {
  var frets = [];
  var first = 0; // track.firstFret : 0  // save for SMART Fretboards
  var last = 23; // track.lastFret : 23  // save for SMART Fretboards

  for (var i = first; i <= last; i++) {
    frets.push(
      <View
        key={i}
        style={{
          flex: 1,
          height: boardWidth * 0.015
        }}
      >
        <Text
          style={{
            fontSize: boardWidth * 0.01,
            textAlign: "center"
          }}
        >
          {i > 0 ? i : "Nut"}
        </Text>
      </View>
    );
  }
  return frets;
};

const FretboardFretLabels = ({ style, track, boardWidth }) =>
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between"
    }}
  >
    {labels(style, track, boardWidth)}
  </View>;

export default FretboardFretLabels;
