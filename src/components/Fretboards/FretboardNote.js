import React from "react";
import { connect } from "react-redux";
import { View, Text } from "react-native";
import { hasNoteForTimeSelector } from "../../selectors";

const FretboardNote = ({ notation, boardWidth, isVisible }) =>
  <View
    style={{
      flex: 1,
      justifyContent: "center"
    }}
  >
    {isVisible &&
      <View
        style={{
          width: "42%",
          aspectRatio: 1,
          backgroundColor: "#17A3E3",
          borderRadius: boardWidth * 0.012,
          alignItems: "center"
        }}
      >
        <Text style={{ fontSize: boardWidth * 0.012 }}>
          {notation}
        </Text>
      </View>}
  </View>;

const mapStateToProps = (state, props) => {
  return {
    isVisible: hasNoteForTimeSelector(state, props)
  };
};

export default connect(mapStateToProps, undefined)(FretboardNote);
