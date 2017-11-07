import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { View, StyleSheet } from "react-native";
import FretMarkers from "../Fretboards/FretboardMarkers";

const AudioFretboardFretBackground = ({ frets }) => (
  <View style={styles.container}>
    {frets.map(index => {
      let backgroundColor = index === 0 ? "#f0b072" : "black";
      return (
        <View key={index} style={{ flex: 1 }}>
          <View style={{ flex: 1, backgroundColor }}>
            <View style={styles.fret} />
            <FretMarkers fret={index} isLeft={false} />
          </View>
        </View>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 2,
    borderColor: "#444444"
  },
  fret: {
    position: "absolute",
    right: 0,
    width: "5%",
    height: "100%",
    backgroundColor: "#CCCCCC"
  }
});

AudioFretboardFretBackground.propTypes = {
  frets: PropTypes.array.isRequired
};

export default AudioFretboardFretBackground;
