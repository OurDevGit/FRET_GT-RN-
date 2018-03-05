import React from "react";
import PropTypes from "prop-types";
import { Text, View, StyleSheet } from "react-native";

const SmartFretText = ({ color, fontSize, trackName }) => (
  <View style={styles.container}>
    <Text style={[styles.smartText, { fontSize, color }]}>SMART</Text>
    <Text style={[styles.fretboardText, { fontSize, color }]}>Fretboard™</Text>

    {trackName && (
      <Text style={[styles.fretboardText, { fontSize, color }]}>
        for {trackName}
      </Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row"
  },
  smartText: {
    height: "100%",
    fontWeight: "800",
    textAlignVertical: "center",
    marginHorizontal: 2
  },
  fretboardText: {
    height: "100%",
    textAlignVertical: "center"
  },
  trackText: {
    height: "100%",
    textAlignVertical: "center",
    marginLeft: 5
  }
});

SmartFretText.propTypes = {
  color: PropTypes.string.isRequired,
  fontSize: PropTypes.number.isRequired,
  trackName: PropTypes.string
};

export default SmartFretText;
