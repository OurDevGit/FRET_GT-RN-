import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  StyleSheet
} from "react-native";
import { onlyUpdateForKeys } from "recompose";
import { isEqual } from "lodash";
import { clearCurrentPattern } from "../../midi-store";
import * as actions from "../../redux/actions";
import { PrimaryBlue } from "../../design";
import { TunerButton } from "../StyleKit";
import FretboardTitleLabel from "./FretboardTitleLabel";
import FretboardLabels from "./FretboardFretLabels";
import FretboardBackground from "./FretboardFretBackground";
import FretboardFrets from "./FretboardFrets";
import FretboardStrings from "./FretboardStrings";
import FretboardCapo from "./FretboardCapo";
import SmartFretText from "../modals/SmartFretText";
import Tuner from "../Tuner";
import {
  startSMARTFretboard,
  trackSMARTFretboard,
  trackTuningTap
} from "../../metrics";

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
      tunerIsActive,
      jamBarTrack,
      isShowingJamBar,
      isPhone,
      isSmart,
      isHidingLabels,
      currentNotation,
      trackIndex,
      showSmart,
      boardWidth
    } = this.props;

    const tuningTrack = tuningTracks[track.name] || {
      fineTuning: 8192,
      notes: []
    };

    let showJamBarButton =
      jamBarTrack.get("patterns").count() > 0 &&
      !isSmart &&
      track.name !== "chordsAndScales";
    let boardTrack =
      isShowingJamBar && trackIndex < 1 ? { name: "jamBar" } : track;

    let shouldShowSmart = isShowingJamBar ? false : showSmart;
    console.log("isShowingJamBar", isShowingJamBar);
    console.log("shouldShowSmart", shouldShowSmart);

    return (
      <View style={[style, { backgroundColor: "#E6D9B9" }]}>
        {!isHidingLabels && (
          <View style={styles.titleContainer}>
            <FretboardTitleLabel
              track={boardTrack}
              isPhone={isPhone}
              isSmart={isSmart}
            />

            <View style={styles.buttonContainer}>
              {showJamBarButton && (
                <TouchableOpacity
                  style={styles.jamBarButton}
                  onPress={this.handleJamBar}
                >
                  <Text
                    style={[styles.jamText, { fontSize: isPhone ? 13 : 16 }]}
                  >
                    JAM
                  </Text>
                  <Text
                    style={[styles.barText, { fontSize: isPhone ? 13 : 16 }]}
                  >
                    Bar™
                  </Text>
                </TouchableOpacity>
              )}

              {shouldShowSmart && (
                <TouchableOpacity
                  style={[
                    styles.smartFretButton,
                    {
                      marginRight: isSmart ? 10 : 0,
                      marginBottom: isSmart ? 10 : 5
                    }
                  ]}
                  onPress={this.handleSMART}
                >
                  <SmartFretText
                    color={PrimaryBlue}
                    fontSize={isSmart ? (isPhone ? 16 : 20) : isPhone ? 13 : 16}
                  />
                </TouchableOpacity>
              )}
              {!isSmart && (
                <TouchableOpacity
                  style={styles.tunerButton}
                  ref={ref => (this.btnTuner = ref)}
                  onPress={() => {
                    this.btnTuner.measure((fx, fy, width, height, px, py) => {
                      const frame = { x: px, y: py, width, height };
                      this.handleToggleTuner(frame);
                    });
                  }}
                >
                  <TunerButton
                    style={{
                      marginTop: isPhone ? 3 : 0,
                      width: isPhone ? 32 : 36,
                      height: isPhone ? 32 : 36
                    }}
                  />
                </TouchableOpacity>
              )}
            </View>

            {this.state.isShowingTuner && (
              <Tuner
                origin={this.state.tunerModalFrame}
                track={track}
                tuningTrack={tuningTrack}
                currentNotation={this.props.currentNotation}
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

          {track.name !== "" && (
            <FretboardFrets
              track={boardTrack}
              tuningTrack={tuningTrack}
              tunerIsActive={tunerIsActive}
              isShowingJamBar={isShowingJamBar}
              isSmart={isSmart}
              trackIndex={trackIndex}
              isLeft={this.state.isLeft}
              currentNotation={currentNotation}
              fretHeight={this.state.fretHeight}
              onLayout={this.handleLayout.bind(this)}
              boardWidth={boardWidth}
            />
          )}

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

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !isEqual(this.state.fretHeight, nextState.fretHeight) ||
      !isEqual(this.state.isLeft, nextState.isLeft) ||
      !isEqual(this.state.isShowingTuner, nextState.isShowingTuner) ||
      !isEqual(this.props.track, nextProps.track) ||
      !isEqual(this.props.tuningTracks, nextProps.tuningTracks) ||
      !isEqual(this.props.jamBarTrack, nextProps.jamBarTrack) ||
      !isEqual(this.props.boardWidth, nextProps.boardWidth) ||
      !isEqual(this.props.leftHandState, nextProps.leftHandState) ||
      !isEqual(this.props.currentNotation, nextProps.currentNotation) ||
      (!isEqual(this.props.isShowingJamBar, nextProps.isShowingJamBar) &&
        this.props.trackIndex < 1)
    );
  }

  handleLayout(e) {
    this.setState({
      fretHeight: e.nativeEvent.layout.height
    });
  }

  handleToggleOrientation = () => {
    this.setState({ isLeft: !this.state.isLeft });
  };

  handleToggleTuner = async frame => {
    if (this.state.isShowingTuner === false) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: "Microphone Access",
            message:
              "Guitar Tunes needs permission to use your microphone so you can tune your guitar"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.setState({ isShowingTuner: true, tunerModalFrame: frame });
          this.props.presentModal();
        } else {
          Alert.alert(
            "Permission Denied",
            "You will be able to enjoy the rest of the app without using your microphone. You can change permission the next time you want to tune your guitar."
          );
        }
      } catch (err) {
        Alert.alert(
          "Permission Error",
          "There was an error checking permission for this service. Please try again later."
        );
      }
    } else {
      this.setState({ isShowingTuner: false });
      this.props.dismissModal();
      trackTuningTap();
    }
  };

  handleJamBar = () => {
    const { track, isShowingJamBar, setJamBar, assignAllGuitars } = this.props;
    let trackName = isShowingJamBar ? track.name : "jamBar";

    clearCurrentPattern();
    setJamBar(!isShowingJamBar);
    assignAllGuitars(trackName);
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

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: -2
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  jamBarButton: {
    minHeight: 20,
    alignContent: "center",
    flexDirection: "row",
    marginRight: 20,
    marginBottom: 5
  },
  smartFretButton: {
    minHeight: 20,
    flexDirection: "row",
    alignContent: "center"
  },
  jamText: {
    height: "100%",
    fontWeight: "800",
    textAlignVertical: "center",
    marginHorizontal: 1,
    color: PrimaryBlue
  },
  barText: {
    height: "100%",
    textAlignVertical: "center",
    color: PrimaryBlue
  },
  tunerButton: {
    flex: -1,
    marginTop: -8,
    marginBottom: -14,
    marginLeft: 10
  }
});

Fretboard.propTypes = {
  isPhone: PropTypes.bool.isRequired,
  isHidingLabels: PropTypes.bool,
  leftHandState: PropTypes.bool.isRequired,
  currentNotation: PropTypes.string.isRequired,
  track: PropTypes.object.isRequired,
  tuningTracks: PropTypes.object.isRequired,
  jamBarTrack: PropTypes.object.isRequired,
  isShowingJamBar: PropTypes.bool.isRequired,
  showSmart: PropTypes.bool.isRequired,
  isSmart: PropTypes.bool.isRequired,
  tunerIsActive: PropTypes.bool.isRequired,
  boardWidth: PropTypes.number.isRequired,
  trackIndex: PropTypes.number.isRequired,
  style: PropTypes.array.isRequired,
  setJamBar: PropTypes.func.isRequired,
  setSmartTrack: PropTypes.func,
  clearSmartTrack: PropTypes.func,
  presentModal: PropTypes.func.isRequired,
  dismissModal: PropTypes.func.isRequired,
  assignAllGuitars: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    tuningTracks: state.get("tuningTracks").toJS(),
    tunerIsActive: state.get("tunerIsActive"),
    jamBarTrack: state.get("jamBarTrack"),
    isShowingJamBar: state.get("isShowingJamBar")
  };
};

export default connect(mapStateToProps, actions)(
  onlyUpdateForKeys([
    "track",
    "tuningTracks",
    "tunerIsActive",
    "jamBarTrack",
    "boardWidth",
    "leftHandState",
    "currentNotation",
    "isShowingJamBar"
  ])(Fretboard)
);
