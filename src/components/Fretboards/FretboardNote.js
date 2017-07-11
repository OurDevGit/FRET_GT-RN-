import React from "react";
import { connect } from "react-redux";
import { View, Text } from "react-native";
import { hasNoteForTimeSelector } from '../../selectors'

// TODO: IMPLEMENT TUNING ADJUSTMENT AND NOTATION SETTINGS

const roots = ["E", "B", "G", "D", "A", "E"]
const scaleForNotation = notation => {
  switch (notation) {
    case "sharps":
      return ["E", "F", "F♯", "G", "G♯", "A", "A♯", "B", "C", "C♯", "D", "D♯"]
    default:
      return ["E", "F", "G♭", "G", "A♭", "A", "B♭", "B", "C", "D♭", "D", "E♭"]
  }
}

const noteName = (fret, string) => {
  const defaultName = roots[string]
  const scale = scaleForNotation()
  const index = scale.indexOf(defaultName) || 0
  const adjusted = fret + index// + adjustment
  var remainder = adjusted % scale.length
  
  if (remainder < 0) {
      remainder = scale.count + remainder
  }
  
  return scale[remainder]
}

const FretboardNote = ({ track, fret, string, stringWidth, isVisible }) => (
  <View
    style={{
      flex: 1,
      alignItems: "center"
    }}
  >
    <View
      style={{
        position: "absolute",
        top: 7 + stringWidth,
        left: -12,
        width: fret < 22 ? "150%" : "100%",
        height: stringWidth,
        backgroundColor: "#222222"
      }}
    />

    <View
      style={{
        position: "absolute",
        top: 7,
        left: -12,
        width: fret < 22 ? "150%" : "100%",
        height: stringWidth,
        backgroundColor: "#CCCCCC"
      }}
    />

    {isVisible &&
      <View
        style={{
          position: "absolute",
          width: "50%",
          aspectRatio: 1,
          backgroundColor: "#17A3E3",
          borderRadius:8,
          alignItems: "center"
        }}
      >
        <Text style={{ fontSize: 10 }}>{noteName(fret, string)}</Text>
      </View>
    }
  </View>
);

const mapStateToProps = (state, props) => {
  return {
    isVisible: hasNoteForTimeSelector(state, props)
  };
};

export default connect(mapStateToProps, undefined)(FretboardNote);
