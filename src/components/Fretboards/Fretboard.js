import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { View, Text, TouchableOpacity } from "react-native";
import { onlyUpdateForKeys } from "recompose";

import * as actions from "../../redux/actions";
import { PrimaryBlue, adjustedFontSize } from "../../design";
import FretboardLabels from "./FretboardFretLabels";
import FretboardBackground from "./FretboardFretBackground";
import FretboardFrets from "./FretboardFrets";
import FretboardStrings from "./FretboardStrings";
import FretboardCapo from "./FretboardCapo";
import SmartFretText from "../modals/SmartFretText";

class Fretboard extends React.Component {
  state = {
    fretHeight: 0,
    isLeft: false
  };

  render() {
    const {
      style,
      track,
      isPhone,
      isSmart,
      isHidingLabels,
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
        {!isHidingLabels && (
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text
              style={{
                fontSize: isPhone ? 13 : 17,
                marginBottom: 1
              }}
            >
              {isSmart ? " " : track.name || " "}
            </Text>

            {showSmart && (
              <TouchableOpacity
                style={{
                  marginRight: isSmart ? 10 : 0,
                  marginBottom: isSmart ? 10 : 5
                }}
                onPress={() => {
                  isSmart
                    ? clearSmartTrack()
                    : setSmartTrack(track, this.state.isLeft);
                }}
              >
                <SmartFretText
                  color={PrimaryBlue}
                  size={isSmart ? (isPhone ? 16 : 20) : isPhone ? 13 : 17}
                />
              </TouchableOpacity>
            )}
          </View>
        )}

        <FretboardLabels
          track={track}
          isSmart={isSmart}
          isLeft={this.state.isLeft}
          boardWidth={boardWidth}
        />
        <View style={{ flex: 1 }}>
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
          <FretboardFrets
            track={track}
            isSmart={isSmart}
            isLeft={this.state.isLeft}
            fretHeight={this.state.fretHeight}
            onLayout={this.handleLayout.bind(this)}
            boardWidth={boardWidth}
          />
          <FretboardCapo
            track={track}
            isSmart={isSmart}
            isLeft={this.state.isLeft}
            fretHeight={this.state.fretHeight}
            boardWidth={boardWidth}
          />
        </View>
      </View>
    );
  }

  componentWillMount() {
    if (this.props.track.isLeft) {
      this.setState({ isLeft: true });
    }
  }

  handleLayout(e) {
    this.setState({
      fretHeight: e.nativeEvent.layout.height
    });
  }

  handleToggleOrientation = () => {
    this.setState({ isLeft: !this.state.isLeft });
  };
}

Fretboard.propTypes = {
  isPhone: PropTypes.bool.isRequired,
  isHidingLabels: PropTypes.bool,
  track: PropTypes.object.isRequired,
  showSmart: PropTypes.bool.isRequired,
  isSmart: PropTypes.bool.isRequired,
  boardWidth: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
  setSmartTrack: PropTypes.func,
  clearSmartTrack: PropTypes.func
};

export default connect(undefined, actions)(
  onlyUpdateForKeys(["track", "boardWidth"])(Fretboard)
);
