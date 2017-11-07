import React from "react";
import PropTypes from "prop-types";
import { View, StyleSheet } from "react-native";

const DigitalNeedle = ({ rotation }) => {
  const transform = { transform: [{ rotate: `${rotation}deg` }] };
  return (
    <View style={[styles.container, transform]}>
      <View style={styles.needle} />
    </View>
  );
};

DigitalNeedle.propTypes = {
  rotation: PropTypes.number.isRequired
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: "-50%",
    height: "130%",
    aspectRatio: 0.015
  },
  needle: {
    position: "absolute",
    top: 0,
    height: "51%",
    aspectRatio: 0.015,
    backgroundColor: "red"
  }
});

export default DigitalNeedle;
