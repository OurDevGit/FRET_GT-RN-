import React from "react";
import PropTypes from "prop-types";
import { View, Text, TouchableOpacity } from "react-native";

import { PrimaryBlue } from "../../design";
import FretboardLabels from "./AudioFretboardFretLabels";
import FretboardBackground from "./AudioFretboardFretBackground";
import FretboardStrings from "./AudioFretboardStrings";

class AudioFretboard extends React.Component {
  state = {
    fretHeight: 0
  };

  render() {
    const {
      style,
      track,
      isPhone,
      isSmart,
      isHidingLabels,
      leftHandState,
      currentNotation,
      trackIndex,
      scrollIndex,
      showSmart,
      boardWidth,
      setSmartTrack,
      clearSmartTrack
    } = this.props;

    return (
      <View
        style={{
          ...style,
          backgroundColor: "#E6D9B9"
        }}
      >
        <FretboardLabels boardWidth={boardWidth} />
        {/* <View style={{ flex: 1 }}>
          <FretboardBackground
            track={track}
            isSmart={isSmart}
            isLeft={this.state.isLeft}
            boardWidth={boardWidth}
            onToggleOrientation={this.handleToggleOrientation}
          />
          <FretboardStrings
            track={track}
            isSmart={isSmart}
            isLeft={this.state.isLeft}
            boardWidth={boardWidth}
          />
        </View> */}
      </View>
    );
  }

  handleLayout(e) {
    this.setState({
      fretHeight: e.nativeEvent.layout.height
    });
  }
}

AudioFretboard.propTypes = {
  isPhone: PropTypes.bool.isRequired,
  isHidingLabels: PropTypes.bool,
  leftHandState: PropTypes.bool.isRequired,
  currentNotation: PropTypes.string.isRequired,
  track: PropTypes.object.isRequired,
  showSmart: PropTypes.bool.isRequired,
  isSmart: PropTypes.bool.isRequired,
  boardWidth: PropTypes.number.isRequired,
  trackIndex: PropTypes.number.isRequired,
  scrollIndex: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
  setSmartTrack: PropTypes.func,
  clearSmartTrack: PropTypes.func
};

export default AudioFretboard;
