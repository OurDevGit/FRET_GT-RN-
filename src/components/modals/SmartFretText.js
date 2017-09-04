import React, { Component } from "react";
import { Text, View } from "react-native";

export default (SmartFretText = ({ color, size, trackName }) =>
  <View
    style={{
      height: size + 2,
      flexDirection: "row"
    }}
  >
    <Text
      style={{
        height: "100%",
        fontWeight: "800",
        textAlignVertical: "center",
        fontSize: size,
        marginHorizontal: 2,
        color: color
      }}
    >
      SMART
    </Text>
    <Text
      style={{
        height: "100%",
        textAlignVertical: "center",
        fontSize: size,
        color: color
      }}
    >
      Fretboard™
    </Text>

    {trackName &&
      <Text
        style={{
          height: "100%",
          textAlignVertical: "center",
          fontSize: size,
          color: color,
          marginLeft: 5
        }}
      >
        for {trackName}
      </Text>}
  </View>);
