import React from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import { FretCapo } from "../StyleKit";

const capo = (track, isSmart, isLeft, boardWidth, fretHeight) => {
  if (fretHeight > 0) {
    var frets = [];
    const first = isSmart ? track.firstFret : 0;
    const last = isSmart ? track.lastFret : 22;
    const diff = last - first;
    const fretWidth = boardWidth / diff;

    for (var i = first; i <= last; i++) {
      const isVisible = track.capo === (isLeft ? 22 - i : i);
      frets.push(
        <View key={i} style={{ flex: 1 }}>
          {isVisible && (
            <FretCapo
              style={{
                position: "absolute",
                right: isLeft ? 12 : 6,
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

const FretboardCapo = ({ track, isSmart, isLeft, boardWidth, fretHeight }) => (
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
    {capo(track, isSmart, isLeft, boardWidth, fretHeight)}
  </View>
);

FretboardCapo.propTypes = {
  track: PropTypes.object.isRequired,
  isSmart: PropTypes.bool.isRequired,
  isLeft: PropTypes.bool.isRequired,
  boardWidth: PropTypes.number.isRequired,
  fretHeight: PropTypes.number.isRequired
};

export default FretboardCapo;
