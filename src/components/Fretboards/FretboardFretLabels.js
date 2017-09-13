import React, { Component } from "react";
import { View, Text } from "react-native";

const labels = (style, track, isSmart, boardWidth) => {
  var frets = [];
  const first = isSmart ? track.firstFret : 0;
  const last = isSmart ? track.lastFret : 23;
  const diff = last - first;

  for (var i = first; i <= last; i++) {
    frets.push(
      <View
        key={i}
        style={{
          flex: 1,
          height: boardWidth / diff / 2
        }}
      >
        <Text
          style={{
            fontSize: boardWidth / diff / 3.5,
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
