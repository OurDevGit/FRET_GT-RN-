import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Text } from "react-native";
import FretboardNote from "./FretboardNote";

// TODO: IMPLEMENT TUNING ADJUSTMENT AND NOTATION SETTINGS

const scaleForNotation = notation => {
  switch (notation) {
    case "sharps":
      return ["E", "F", "F♯", "G", "G♯", "A", "A♯", "B", "C", "C♯", "D", "D♯"];
    default:
      return ["E", "F", "G♭", "G", "A♭", "A", "B♭", "B", "C", "D♭", "D", "E♭"];
  }
};

const notation = (fret, string) => {
  const roots = ["E", "B", "G", "D", "A", "E"];
  const defaultName = roots[string];
  const scale = scaleForNotation();
  const index = scale.indexOf(defaultName) || 0;
  const adjusted = fret + index; // + adjustment
  var remainder = adjusted % scale.length;

  if (remainder < 0) {
    remainder = scale.count + remainder;
  }

  return scale[remainder];
};

const notes = (track, fret, boardWidth) => {
  var views = [];

  for (var i = 0; i < 6; i++) {
    if (i < 4 || !track.isBass) {
      views.push(
        <FretboardNote
          key={i}
          track={track.name}
          fret={fret}
          string={track.isBass ? i + 2 : i}
          notation={notation(fret, i)}
          boardWidth={boardWidth}
        />
      );
    }
  }
  return views;
};

const frets = (track, isSmart, boardWidth) => {
  var frets = [];
  var first = isSmart ? track.firstFret : 0;
  var last = isSmart ? track.lastFret : 23;

  for (var i = first; i <= last; i++) {
    frets.push(
      <View key={i} style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {notes(track, i, boardWidth)}
        </View>
      </View>
    );
  }
  return frets;
};

const FretboardFrets = ({ track, isSmart, boardWidth }) => (
  <View
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      paddingVertical: track.isBass ? boardWidth * 0.005 : boardWidth * 0.003,
      flexDirection: "row",
      justifyContent: "space-between"
    }}
  >
    {frets(track, isSmart, boardWidth)}
  </View>
);

export default FretboardFrets;
