import React from "react";
import PropTypes from "prop-types";
import { View, StyleSheet } from "react-native";

const AudioFretboardStrings = ({ currentString, isBass }) => {
  const strings = isBass ? [2, 3, 4, 5] : [0, 1, 2, 3, 4, 5];
  const origHeight = isBass ? 4 : 2;

  return (
    <View style={styles.container}>
      {strings.map(index => {
        const height = currentString === index ? 8 : origHeight;
        const backgroundColor = currentString === index ? "#17A3E3" : "#CCCCCC";
        return (
          <View key={index} style={styles.container}>
            <View style={[styles.string, { height, backgroundColor }]} />
            <View style={styles.shadow} />
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    paddingVertical: 10
  },
  string: {
    width: "100%"
  },
  shadow: {
    width: "100%",
    height: 1,
    backgroundColor: "#222222"
  }
});

AudioFretboardStrings.propTypes = {
  currentString: PropTypes.number.isRequired,
  isBass: PropTypes.bool.isRequired
};

export default AudioFretboardStrings;
