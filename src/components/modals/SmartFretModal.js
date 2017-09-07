import React from "react";
import { connect } from "react-redux";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import PropTypes from "prop-types";
import Dimensions from "Dimensions";
import * as actions from "../../redux/actions";

import Popover from "./Popover";
import { ModalType } from "./ModalType";
import { PrimaryBlue, playerBackground, scaledFontSize } from "../../design";
import SmartFretText from "./SmartFretText";
import PlaybackPrimary from "../Playback/PlaybackPrimary";
import PlaybackTimeline from "../Playback/PlaybackTimeline";
import PlaybackSecondary from "../Playback/PlaybackSecondary";
import PlaybackCompact from "../Playback/Compact";
import PlaybackTimelineCompact from "../Playback/Compact/Timeline";
import Fretboard from "../Fretboards/Fretboard";

class SmartFretModal extends React.Component {
  render() {
    const frets = this.props.track.lastFret - this.props.track.firstFret;
    const boardWidth = Dimensions.get("window").width;
    const boardHeight = boardWidth / frets * 3;
    const playbackHeight = Dimensions.get("window").height - boardHeight - 40;
    const isCompact = playbackHeight < 150;
    const isPhone = Dimensions.get("window").height < 500;

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
              height: 40,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "black"
            }}
          >
            <TouchableOpacity
              style={{
                flex: -1,
                position: "absolute",
                left: 4,
                height: "100%"
              }}
              onPress={this.props.clearSmartTrack}
            >
              <Text
                style={{
                  fontSize: scaledFontSize(1.2),
                  fontWeight: "400",
                  textAlign: "left",
                  marginLeft: 5,
                  height: "100%",
                  textAlignVertical: "center",
                  color: "white"
                }}
              >
                Done
              </Text>
            </TouchableOpacity>

            <SmartFretText
              color={"white"}
              size={scaledFontSize(1.2)}
              trackName={this.props.track.name}
            />
          </View>

          {isCompact ? (
            <View
              style={{
                flex: 1,
                backgroundColor: playerBackground
              }}
            >
              <PlaybackCompact
                title={this.props.mediaTitle}
                trackCount={this.props.trackCount}
                isPlaying={this.props.isPlaying}
                tempo={this.props.tempo}
                loopIsEnabled={this.props.loopIsEnabled}
                onToggleLibrary={this.props.onToggleLibrary}
                onPreviousPress={this.props.onPreviousPress}
                onBackPress={this.props.onBackPress}
                onPlayPausePress={this.props.onPlayPausePress}
                onForwardPress={this.props.onForwardPress}
                onNextPress={this.props.onNextPress}
                onLoopEnable={this.props.onLoopEnable}
                onSelectTempo={this.props.onSelectTempo}
              />
              <PlaybackTimelineCompact
                progress={this.props.progress}
                duration={this.props.duration}
                markers={this.props.markers}
                currentLoop={this.props.currentLoop}
                loopIsEnabled={this.props.loopIsEnabled}
                onScrub={this.props.onScrub}
                onMarkerPress={this.props.onMarkerPress}
                onMarkerLongPress={this.props.onMarkerLongPress}
              />
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                backgroundColor: playerBackground,
                margin: this.props.isCompact ? 0 : 4,
                padding: this.props.isCompact ? 0 : 2,
                borderRadius: this.props.isCompact ? 0 : 6
              }}
            >
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
          )}

          <Fretboard
            track={this.props.track}
            isSmart={true}
            isHidingLabels={isPhone}
            boardWidth={boardWidth}
            style={{
              width: boardWidth,
              height: boardHeight,
              paddingTop: 5,
              paddingBottom: 15
            }}
          />
        </View>
      </Popover>
    );
  }
}

SmartFretModal.propTypes = {
  track: PropTypes.object,
  mediaId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  trackCount: PropTypes.number.isRequired,
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
