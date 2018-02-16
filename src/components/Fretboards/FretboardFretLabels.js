import React from "react";
import PropTypes from "prop-types";
import { View, Text } from "react-native";

const labels = (style, track, isSmart, isLeft, boardWidth) => {
  var frets = [];
  const first = isSmart ? track.firstFret : 0;
  const last = isSmart ? track.lastFret : 22;
  const diff = last - first;
  const labelHeight = Math.min(34, boardWidth / diff / 2.5);
  const labelSize = Math.min(24, boardWidth / diff / 4);

  for (var i = first; i <= last; i++) {
    var label = "Nut";
    if (isLeft && i < last) {
      label = last - i;
    } else if (!isLeft && i > 0) {
      label = i;
    }
    frets.push(
      <View
        key={i}
        style={{
          flex: 1,
          height: labelHeight
        }}
      >
        <Text
          style={{
            fontSize: labelSize,
            textAlign: "center"
          }}
        >
          {label}
        </Text>
      </View>
    );
  }
  return frets;
};

const FretboardFretLabels = ({ style, track, isSmart, isLeft, boardWidth }) => (
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between"
    }}
  >
    {labels(style, track, isSmart, isLeft, boardWidth)}
  </View>
);

FretboardFretLabels.propTypes = {
  style: PropTypes.object,
  track: PropTypes.object.isRequired,
  isSmart: PropTypes.bool.isRequired,
  isLeft: PropTypes.bool.isRequired,
  boardWidth: PropTypes.number.isRequired
};

export default FretboardFretLabels;
