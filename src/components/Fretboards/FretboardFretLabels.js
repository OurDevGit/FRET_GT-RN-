import React, { Component } from "react";
import { View, Text } from "react-native";

const labels = (style, track, isSmart, boardWidth) => {
  var frets = [];
  var first = isSmart ? track.firstFret : 0;
  var last = isSmart ? track.lastFret : 23;

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

const FretboardFretLabels = ({ style, track, isSmart, boardWidth }) => (
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between"
    }}
  >
    {labels(style, track, isSmart, boardWidth)}
  </View>
);

export default FretboardFretLabels;
