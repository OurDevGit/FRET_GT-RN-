import React from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet } from "react-native";

const AudioFretboardLabels = ({ frets }) => (
  <View style={styles.container}>
    {frets.map(index => {
      return (
        <Text key={index} style={styles.label}>
          {index === 0 ? "Nut" : index}
        </Text>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4
  },
  label: {
    flex: 1,
    fontSize: 16,
    textAlign: "center"
  }
});

AudioFretboardLabels.propTypes = {
  frets: PropTypes.array.isRequired
};

export default AudioFretboardLabels;
