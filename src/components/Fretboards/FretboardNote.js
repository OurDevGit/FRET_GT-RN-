import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
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

FretboardNote.propTypes = {
  track: PropTypes.string.isRequired,
  fret: PropTypes.number.isRequired,
  frets: PropTypes.number.isRequired,
  string: PropTypes.number.isRequired,
  notation: PropTypes.string.isRequired,
  boardWidth: PropTypes.number.isRequired,
  fretHeight: PropTypes.number.isRequired,
  isSmart: PropTypes.bool.isRequired,
  isVisible: PropTypes.bool.isRequired
};

export default connect(mapStateToProps, undefined)(
  onlyUpdateForKeys(["isVisible", "notation", "fretHeight"])(FretboardNote)
);
