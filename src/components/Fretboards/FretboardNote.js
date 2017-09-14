import React from "react";
import { connect } from "react-redux";
import { View, Text } from "react-native";
import { onlyUpdateForKeys } from "recompose";
import { hasNoteForTimeSelector } from "../../selectors";

const FretboardNote = ({
  frets,
  notation,
  boardWidth,
  fretHeight,
  isVisible,
  isSmart
}) => (
  <View
    style={{
      flex: 1,
      aspectRatio: 1,
      justifyContent: "center",
      alignItems: "center",
      marginVertical: 1
    }}
  >
    {isVisible && (
      <View
        style={{
          flex: -1,
          height: fretHeight / 6 - 2,
          aspectRatio: 1,
          backgroundColor: "#17A3E3",
          borderRadius: 1000,
          alignItems: "center"
        }}
      >
        <Text
          style={{
            height: "100%",
            fontSize: fretHeight / 6 / 2,
            textAlignVertical: "center"
          }}
        >
          {notation}
        </Text>
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
  onlyUpdateForKeys(["isVisible", "fretHeight"])(FretboardNote)
);
