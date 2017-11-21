import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { View, Text, TouchableOpacity } from "react-native";
import { onlyUpdateForKeys } from "recompose";

import * as actions from "../../redux/actions";
import { PrimaryBlue } from "../../design";
import { TunerButton } from "../StyleKit";
import FretboardLabels from "./FretboardFretLabels";
import FretboardBackground from "./FretboardFretBackground";
import FretboardFrets from "./FretboardFrets";
import FretboardStrings from "./FretboardStrings";
import FretboardCapo from "./FretboardCapo";
import SmartFretText from "../modals/SmartFretText";
import Tuner from "../Tuner";
import { startSMARTFretboard, trackSMARTFretboard } from "../../metrics";

class Fretboard extends React.Component {
  state = {
    fretHeight: 0,
    isLeft: false,
    isShowingTuner: false,
    tunerModalFrame: {}
  };

  render() {
    const {
      style,
      track,
      tuningTracks,
      guitars,
      isPhone,
      isSmart,
      isHidingLabels,
      tuningMode,
      currentNotation,
      trackIndex,
      scrollIndex,
      showSmart,
      boardWidth
    } = this.props;
    const hasAlternateTuning =
      track.tuning !== undefined || track.fullTuning !== undefined;

    const assigned = guitars
      .filter(item => item.track === track.name)
      .map((item, index) => {
        const name =
          item.name !== undefined
            ? item.name.replace("'s Fretlight", "")
            : `Fretlight ${index + 1}`;
        return { ...item, name };
      });

    var assignedLabel = "";
    if (assigned.length > 0) {
      assignedLabel = "  |  Assigned to:";
      assigned.forEach(item => (assignedLabel += ` ${item.name},`));
      assignedLabel = assignedLabel.replace(/,\s*$/, "");
    }

    const tuningTrack = tuningTracks[track.name] || {
      fineTuning: 8192,
      notes: []
    };

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

              {!isSmart && (
                <Text
                  numberOfLines={1}
                  ellipsizeMode={"tail"}
                  style={{
                    fontSize: isPhone ? 13 : 17,
                    marginBottom: 1,
                    color: "#4e3200"
                  }}
                >
                  {assignedLabel}
                </Text>
              )}
            </Text>

            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "flex-end"
              }}
            >
              {showSmart && (
                <TouchableOpacity
                  style={{
                    marginRight: isSmart ? 10 : 0,
                    marginBottom: isSmart ? 10 : 5
                  }}
                  onPress={this.handleSMART}
                >
                  <SmartFretText
                    color={PrimaryBlue}
                    size={isSmart ? (isPhone ? 16 : 20) : isPhone ? 13 : 17}
                  />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={{
                  flex: -1,
                  marginTop: -8,
                  marginBottom: -14,
                  marginLeft: 10
                }}
                ref={ref => (this.btnTuner = ref)}
                onPress={() => {
                  this.btnTuner.measure((fx, fy, width, height, px, py) => {
                    const frame = { x: px, y: py, width, height };
                    this.handleToggleTuner(frame);
                  });
                }}
              >
                <TunerButton
                  hasAlternateTuning={hasAlternateTuning}
                  size={{ width: 40, height: 40 }}
                />
              </TouchableOpacity>
            </View>

            {this.state.isShowingTuner && (
              <Tuner
                origin={this.state.tunerModalFrame}
                track={track}
                tuningTrack={tuningTrack}
                isDigital={tuningMode === "digital"}
                assignedGuitars={assigned}
                currentNotation={this.props.currentNotation}
                onToggleTuningMode={this.handleToggleTuningMode}
                onClose={this.handleToggleTuner}
              />
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
            trackIndex={trackIndex}
            scrollIndex={scrollIndex}
            isLeft={this.state.isLeft}
            currentNotation={currentNotation}
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
    this.setState({ isLeft: this.props.leftHandState });
  }

  handleLayout(e) {
    this.setState({
      fretHeight: e.nativeEvent.layout.height
    });
  }

  handleToggleOrientation = () => {
    this.setState({ isLeft: !this.state.isLeft });
  };

  handleToggleTuningMode = () => {
    const mode = this.props.tuningMode === "digital" ? "audio" : "digital";
    this.props.setTuningMode(mode);
  };

  handleToggleTuner = frame => {
    const isShowingTuner = !this.state.isShowingTuner;
    this.setState({ isShowingTuner, tunerModalFrame: frame });
  };

  handleSMART = () => {
    const { track, isSmart, setSmartTrack, clearSmartTrack } = this.props;
    if (isSmart) {
      trackSMARTFretboard();
      clearSmartTrack();
    } else {
      startSMARTFretboard();
      setSmartTrack(track, this.state.isLeft);
    }
  };
}

Fretboard.propTypes = {
  isPhone: PropTypes.bool.isRequired,
  isHidingLabels: PropTypes.bool,
  leftHandState: PropTypes.bool.isRequired,
  currentNotation: PropTypes.string.isRequired,
  tuningMode: PropTypes.string.isRequired,
  track: PropTypes.object.isRequired,
  tuningTracks: PropTypes.object.isRequired,
  guitars: PropTypes.array.isRequired,
  showSmart: PropTypes.bool.isRequired,
  isSmart: PropTypes.bool.isRequired,
  boardWidth: PropTypes.number.isRequired,
  trackIndex: PropTypes.number.isRequired,
  scrollIndex: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
  setSmartTrack: PropTypes.func,
  clearSmartTrack: PropTypes.func,
  setTuningMode: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    tuningTracks: state.get("tuningTracks").toJS(),
    guitars: state.get("guitars").toJS(),
    tuningMode: state.get("tuningMode")
  };
};

export default connect(mapStateToProps, actions)(
  onlyUpdateForKeys([
    "track",
    "tuningTracks",
    "guitars",
    "tuningMode",
    "boardWidth",
    "leftHandState",
    "currentNotation"
  ])(Fretboard)
);
