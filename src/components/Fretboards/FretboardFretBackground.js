import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { View, TouchableWithoutFeedback } from "react-native";
import FretMarkers from "./FretboardMarkers";

const frets = (track, isSmart, isLeft, boardWidth, onToggleOrientation) => {
  var frets = [];
  const first = isSmart ? track.firstFret : 0;
  const last = isSmart ? track.lastFret : 23;
  const diff = last - first;

  for (let i = first; i <= last; i++) {
    let color = "black";
    if ((isLeft && i === last) || (!isLeft && i === 0)) {
      color = "#f0b072";
    }
    frets.push(
      <TouchableWithoutFeedback
        key={i}
        style={{ flex: 1 }}
        onPress={() => {
          if (color === "#f0b072") {
            onToggleOrientation();
          }
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: color
          }}
        >
          <View
            style={{
              position: "absolute",
              right: 0,
              width: boardWidth * 0.004,
              height: "100%",
              backgroundColor: "#CCCCCC"
            }}
          />

          <FretMarkers fret={i} isLeft={isLeft} />
        </View>
      </TouchableWithoutFeedback>
    );
  }
  return frets;
};

const FretboardFretBackground = ({
  track,
  isSmart,
  isLeft,
  boardWidth,
  onToggleOrientation
}) => (
  <View
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      flexDirection: "row",
      justifyContent: "space-between"
    }}
  >
    {frets(track, isSmart, isLeft, boardWidth, onToggleOrientation)}
  </View>
);

FretboardFretBackground.propTypes = {
  track: PropTypes.object.isRequired,
  isSmart: PropTypes.bool.isRequired,
  isLeft: PropTypes.bool.isRequired,
  boardWidth: PropTypes.number.isRequired,
  onToggleOrientation: PropTypes.func.isRequired
};

export default FretboardFretBackground;
