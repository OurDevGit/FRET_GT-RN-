import React from "react";
import PropTypes from "prop-types";
import { View } from "react-native";

const bar = { position: "absolute", width: "100%", height: "100%" };
const fretCheck = (fret, number, isLeft) => {
  return fret === (isLeft ? 22 - number : number);
};
const markers = (fret, isLeft) => {
  if (
    fretCheck(fret, 3, isLeft) ||
    fretCheck(fret, 5, isLeft) ||
    fretCheck(fret, 7, isLeft) ||
    fretCheck(fret, 9, isLeft) ||
    fretCheck(fret, 15, isLeft) ||
    fretCheck(fret, 17, isLeft) ||
    fretCheck(fret, 19, isLeft) ||
    fretCheck(fret, 21, isLeft)
  ) {
    return (
      <View
        style={{
          width: "26%",
          aspectRatio: 1,
          backgroundColor: "#CCCCCC",
          borderRadius: 1000,
          marginLeft: -4
        }}
      />
    );
  } else if (fretCheck(fret, 12, isLeft)) {
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "space-around",
          height: "100%",
          width: "100%",
          paddingVertical: "50%"
        }}
      >
        <View
          style={{
            width: "26%",
            aspectRatio: 1,
            backgroundColor: "#CCCCCC",
            borderRadius: 1000,
            marginLeft: -4
          }}
        />
        <View
          style={{
            width: "26%",
            aspectRatio: 1,
            backgroundColor: "#CCCCCC",
            borderRadius: 1000,
            marginLeft: -4
          }}
        />
      </View>
    );
  }
};

const FretboardMarkers = ({ fret, isLeft }) => (
  <View
    style={{
      position: "absolute",
      width: "100%",
      height: "100%",
      flex: 1,
      alignItems: "center",
      justifyContent: "center"
    }}
  >
    {markers(fret, isLeft)}
  </View>
);

FretboardMarkers.propTypes = {
  isLeft: PropTypes.bool.isRequired,
  fret: PropTypes.number.isRequired
};

export default FretboardMarkers;
