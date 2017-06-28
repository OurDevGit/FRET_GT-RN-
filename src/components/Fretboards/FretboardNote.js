import React from "react";
import { connect } from "react-redux";
import { View, Text } from "react-native";
import { hasNoteForTimeSelector } from '../../selectors'

const FretboardNote = ({ track, fret, string, isVisible }) => (
  <View
    style={{
      width: "50%",
      aspectRatio: 1
    }}
  >
    {isVisible &&
      <View
        style={{
          flex: 1,
          backgroundColor: "#17A3E3",
          borderRadius:8,
          alignItems: "center"
        }}
      >
        <Text style={{ fontSize: 10 }}>C♭</Text>
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
