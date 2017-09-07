import React from "react";
import { connect } from "react-redux";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import PropTypes from "prop-types";
import Dimensions from "Dimensions";
import * as actions from "../../redux/actions";

import Popover from "./Popover";
import { ModalType } from "./ModalType";
import { PrimaryBlue } from "../../design";
import SmartFretText from "./SmartFretText";
import PlaybackPrimary from "../Playback/PlaybackPrimary";
import PlaybackTimeline from "../Playback/PlaybackTimeline";
import PlaybackSecondary from "../Playback/PlaybackSecondary";
import Fretboard from "../Fretboards/Fretboard";

class SmartFretModal extends React.Component {
  render() {
    return (
      <Popover
        type={ModalType.Full}
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "white"
        }}
        isVisible={this.props.track.name !== undefined}
        onDismiss={this.props.clearSmartTrack}
      >
        <View
          style={{
            flex: 1
          }}
        >
          <View
            style={{
              width: "100%",
              height: 50,
              flexDirection: "row",
              justifyContent: "center",
              backgroundColor: "black"
            }}
          >
            <TouchableOpacity
              style={{
                flex: -1,
                position: "absolute",
                top: 4,
                left: 4
              }}
              onPress={this.props.clearSmartTrack}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "400",
                  textAlign: "left",
                  color: "white"
                }}
              >
                Done
              </Text>
            </TouchableOpacity>

            <SmartFretText
              color={"white"}
              size={20}
              trackName={this.props.track.name}
            />
          </View>

          <View style={{ flex: 1 }}>
            <PlaybackPrimary
              mediaId={this.props.mediaId}
              title={this.props.mediaTitle}
              isPlaying={this.props.isPlaying}
              onPreviousPress={this.props.onPreviousPress}
              onBackPress={this.props.onBackPress}
              onPlayPausePress={this.props.onPlayPausePress}
              onForwardPress={this.props.onForwardPress}
              onNextPress={this.props.onNextPress}
            />
            <PlaybackTimeline
              progress={this.props.progress}
              duration={this.props.duration}
              markers={this.props.markers}
              currentLoop={this.props.currentLoop}
              loopIsEnabled={this.props.loopIsEnabled}
              onScrub={this.props.onScrub}
              onMarkerPress={this.props.onMarkerPress}
              onMarkerLongPress={this.props.onMarkerLongPress}
              onLoopEnable={this.props.onLoopEnable}
            />
            <PlaybackSecondary
              mediaId={this.props.mediaId}
              tempo={this.props.tempo}
              loopIsEnabled={this.props.loopIsEnabled}
              currentLoop={this.props.currentLoop}
              connectedDevices={this.props.connectedDevices}
              onSelectTempo={this.props.onSelectTempo}
              onLoopEnable={this.props.onLoopEnable}
              onLoopBegin={this.props.onLoopBegin}
              onLoopEnd={this.props.onLoopEnd}
              onSetCurrentLoop={this.props.onSetCurrentLoop}
              onClearCurrentLoop={this.props.onClearCurrentLoop}
              onPrevStep={this.props.onPrevStep}
              onNextStep={this.props.onNextStep}
              onDisplayInfo={this.props.onDisplayInfo}
            />
          </View>

          <Fretboard
            track={this.props.track}
            isSmart={true}
            boardWidth={Dimensions.get("window")}
            style={{
              flex: 1
            }}
          />
        </View>
      </Popover>
    );
  }
}

SmartFretModal.propTypes = {
  mediaId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  progress: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
  markers: PropTypes.object.isRequired,
  currentLoop: PropTypes.object.isRequired,
  loopIsEnabled: PropTypes.bool.isRequired,
  tempo: PropTypes.number.isRequired,
  connectedDevices: PropTypes.number.isRequired,
  onPreviousPress: PropTypes.func.isRequired,
  onBackPress: PropTypes.func.isRequired,
  onPlayPausePress: PropTypes.func.isRequired,
  onForwardPress: PropTypes.func.isRequired,
  onNextPress: PropTypes.func.isRequired,
  onScrub: PropTypes.func.isRequired,
  onMarkerPress: PropTypes.func.isRequired,
  onMarkerLongPress: PropTypes.func.isRequired,
  onLoopEnable: PropTypes.func.isRequired,
  onLoopBegin: PropTypes.func.isRequired,
  onLoopEnd: PropTypes.func.isRequired,
  onSetCurrentLoop: PropTypes.func.isRequired,
  onClearCurrentLoop: PropTypes.func.isRequired,
  onPrevStep: PropTypes.func.isRequired,
  onNextStep: PropTypes.func.isRequired,
  onDisplayInfo: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => {
  return {
    track: state.get("smartTrack")
  };
};

export default connect(mapStateToProps, actions)(SmartFretModal);
