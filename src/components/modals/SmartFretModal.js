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

const SmartFretModal = props => (
  <Popover
    type={ModalType.Full}
    style={{
      width: "100%",
      height: "100%",
      backgroundColor: "white"
    }}
    isVisible={props.track.name !== undefined}
    onDismiss={props.clearSmartTrack}
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
          onPress={props.clearSmartTrack}
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

        <SmartFretText color={"white"} size={20} trackName={props.track.name} />
      </View>

      <View style={{ flex: 1 }}>
        <PlaybackPrimary
          mediaId={props.mediaId}
          title={props.mediaTitle}
          isPlaying={props.isPlaying}
          onPreviousPress={props.onPreviousPress}
          onBackPress={props.onBackPress}
          onPlayPausePress={props.onPlayPausePress}
          onForwardPress={props.onForwardPress}
          onNextPress={props.onNextPress}
        />
        <PlaybackTimeline
          progress={props.progress}
          duration={props.duration}
          markers={props.markers}
          currentLoop={props.currentLoop}
          loopIsEnabled={props.loopIsEnabled}
          onScrub={props.onScrub}
          onMarkerPress={props.onMarkerPress}
          onMarkerLongPress={props.onMarkerLongPress}
          onLoopEnable={props.onLoopEnable}
        />
        <PlaybackSecondary
          mediaId={props.mediaId}
          tempo={props.tempo}
          loopIsEnabled={props.loopIsEnabled}
          currentLoop={props.currentLoop}
          connectedDevices={props.connectedDevices}
          onSelectTempo={props.onSelectTempo}
          onLoopEnable={props.onLoopEnable}
          onLoopBegin={props.onLoopBegin}
          onLoopEnd={props.onLoopEnd}
          onSetCurrentLoop={props.onSetCurrentLoop}
          onClearCurrentLoop={props.onClearCurrentLoop}
          onPrevStep={props.onPrevStep}
          onNextStep={props.onNextStep}
          onDisplayInfo={props.onDisplayInfo}
        />
      </View>

      <Fretboard
        track={props.track}
        boardWidth={Dimensions.get("window")}
        style={{
          flex: 1
        }}
      />
    </View>
  </Popover>
);

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
