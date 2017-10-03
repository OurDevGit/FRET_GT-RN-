import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { View, Text } from "react-native";
import FretboardNote from "./FretboardNote";
import { FretCapo } from "../StyleKit";

const capo = (track, isSmart, boardWidth, fretHeight) => {
  if (fretHeight > 0) {
    var frets = [];
    const first = isSmart ? track.firstFret : 0;
    const last = isSmart ? track.lastFret : 23;
    const diff = last - first;
    const fretWidth = boardWidth / diff;

    for (var i = first; i <= last; i++) {
      frets.push(
        <View key={i} style={{ flex: 1 }}>
          {track.capo === i && (
            <FretCapo
              style={{
                position: "absolute",
                right: 6,
                top: 0,
                width: fretWidth - 20,
                height: fretHeight + 15
              }}
            />
          )}
        </View>
      );
    }
    return frets;
  }
};

const FretboardCapo = ({ track, isSmart, boardWidth, fretHeight }) => (
  <View
    style={{
      position: "absolute",
      top: -12,
      left: 0,
      width: "100%",
      height: fretHeight + 15,
      flexDirection: "row",
      justifyContent: "space-between"
    }}
  >
    {capo(track, isSmart, boardWidth, fretHeight)}
  </View>
);

FretboardCapo.propTypes = {
  track: PropTypes.object.isRequired,
  isSmart: PropTypes.bool.isRequired,
  boardWidth: PropTypes.number.isRequired,
  fretHeight: PropTypes.number.isRequired
};

export default FretboardCapo;
