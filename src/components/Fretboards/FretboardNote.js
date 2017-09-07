import React from "react";
import { connect } from "react-redux";
import { View, Text } from "react-native";
import { onlyUpdateForKeys } from "recompose";
import { hasNoteForTimeSelector } from "../../selectors";

const FretboardNote = ({ frets, notation, boardWidth, isVisible, isSmart }) => (
  <View
    style={{
      flex: 1,
      justifyContent: "center"
    }}
  >
    {isVisible && (
      <View
        style={{
          width: "41%",
          aspectRatio: 1,
          backgroundColor: "#17A3E3",
          borderRadius: 1000,
          alignItems: "center"
        }}
      >
        <Text style={{ fontSize: boardWidth / frets / 4 }}>{notation}</Text>
      </View>
    )}
  </View>
);

const mapStateToProps = (state, props) => {
  return {
    isVisible: hasNoteForTimeSelector(state, props)
  };
};

export default connect(mapStateToProps, undefined)(
  onlyUpdateForKeys(["isVisible"])(FretboardNote)
);
