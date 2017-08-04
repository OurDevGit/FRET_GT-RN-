import React, { Component } from "react";
import { View } from "react-native";

const strings = (track, boardWidth) => {
  var views = [];
  var count = track.isBass ? 4 : 6;
  var stringWidth = Math.round(
    track.isBass ? boardWidth * 0.002 : boardWidth * 0.0015
  );
  console.log(stringWidth);

  for (var i = 0; i < count; i++) {
    views.push(
      <View
        key={i}
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center"
        }}
      >
        <View
          style={{
            width: "100%",
            height: stringWidth,
            backgroundColor: "#CCCCCC"
          }}
        />
        <View
          style={{
            width: "100%",
            height: 1,
            backgroundColor: "#222222"
          }}
        />
      </View>
    );
  }

  return views;
};

const FretboardStrings = ({ track, boardWidth }) =>
  <View
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      paddingVertical: track.isBass ? boardWidth * 0.005 : boardWidth * 0.003,
      flexDirection: "column",
      justifyContent: "space-between"
    }}
  >
    {strings(track, boardWidth)}
  </View>;

export default FretboardStrings;
