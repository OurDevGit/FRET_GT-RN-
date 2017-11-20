import React from "react";
import PropTypes from "prop-types";
import { Text, View } from "react-native";

const SmartFretText = ({ color, size, trackName }) => (
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

    {trackName && (
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
      </Text>
    )}
  </View>
);

SmartFretText.propTypes = {
  color: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  trackName: PropTypes.string
};

export default SmartFretText;
