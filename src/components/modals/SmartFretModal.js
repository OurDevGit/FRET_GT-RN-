import React from "react";
import { connect } from "react-redux";
import { View, Text, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import Dimensions from "Dimensions";
import * as actions from "../../redux/actions";

import Popover from "./Popover";
import { ModalType } from "./ModalType";
import { playerBackground } from "../../design";
import SmartFretText from "./SmartFretText";
import PlaybackPrimary from "../Playback/PlaybackPrimary";
import PlaybackTimeline from "../Playback/PlaybackTimeline";
import PlaybackSecondary from "../Playback/PlaybackSecondary";
import PlaybackCompact from "../Playback/Compact";
import PlaybackTimelineCompact from "../Playback/Compact/Timeline";
import Fretboard from "../Fretboards/Fretboard";
import { startSMARTFretboard, trackSMARTFretboard } from "../../metrics";

class SmartFretModal extends React.Component {
  constructor(props) {
    super(props);
    this.isTracking = false;
  }

  render() {
    const frets = this.props.track.lastFret - this.props.track.firstFret;
    const boardWidth = Dimensions.get("window").width;
    const boardHeight = Math.min(
      boardWidth / frets * (this.props.isPhone ? 4 : 3),
      Dimensions.get("window").height - 150
    );
    const playbackHeight = Dimensions.get("window").height - boardHeight - 40;
    const isCompact = playbackHeight < 150;

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
                  fontSize: this.props.isPhone ? 16 : 18,
                  fontWeight: "600",
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
              size={this.props.isPhone ? 16 : 18}
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
                mediaId={this.props.mediaId}
                trackCount={this.props.trackCount}
                isPlaying={this.props.isPlaying}
                isVideo={false}
                isPhone={this.props.isPhone}
                isSmart={true}
                tempo={this.props.tempo}
                loopIsEnabled={this.props.loopIsEnabled}
                currentLoop={this.props.currentLoop}
                onToggleLibrary={this.props.onToggleLibrary}
                onPreviousPress={this.props.onPreviousPress}
                onBackPress={this.props.onBackPress}
                onPlayPausePress={this.props.onPlayPausePress}
                onForwardPress={this.props.onForwardPress}
                onNextPress={this.props.onNextPress}
                onLoopEnable={this.props.onLoopEnable}
                onSelectTempo={this.props.onSelectTempo}
                onSetCurrentLoop={this.props.onSetCurrentLoop}
                onClearCurrentLoop={this.props.onClearCurrentLoop}
              />
              <PlaybackTimelineCompact
                progress={this.props.progress}
                duration={this.props.duration}
                markers={this.props.markers}
                currentLoop={this.props.currentLoop}
                loopIsEnabled={this.props.loopIsEnabled}
                onSeekStart={this.handleSeekStart}
                onSeek={this.handleSeek}
                onSeekEnd={this.handleSeekEnd}
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
                artist={this.props.artist}
                artworkURL={this.props.artworkURL}
                isPlaying={this.props.isPlaying}
                isPhone={this.props.isPhone}
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
                onSeek={this.props.onSeek}
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
                isPhone={this.props.isPhone}
                isVideo={false}
                isFullscreen={false}
                onSelectTempo={this.props.onSelectTempo}
                onLoopEnable={this.props.onLoopEnable}
                onLoopBegin={this.props.onLoopBegin}
                onLoopEnd={this.props.onLoopEnd}
                onSetCurrentLoop={this.props.onSetCurrentLoop}
                onClearCurrentLoop={this.props.onClearCurrentLoop}
                onPrevStep={this.props.onPrevStep}
                onNextStep={this.props.onNextStep}
                onDisplayInfo={this.props.onDisplayInfo}
                onToggleFretlightAdmin={this.props.onToggleFretlightAdmin}
              />
            </View>
          )}

          <Fretboard
            track={this.props.track}
            isSmart={true}
            isPhone={this.props.isPhone}
            isHidingLabels={this.props.isPhone}
            leftHandState={this.props.leftHandState}
            currentNotation={this.props.currentNotation}
            showSmart={!this.props.isPhone}
            boardWidth={boardWidth}
            trackIndex={-1}
            scrollIndex={-1}
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

  shouldComponentUpdate(nextProps) {
    const track = this.props.track || { name: "" };

    return (
      track.name !== nextProps.track.name ||
      this.props.isPlaying !== nextProps.isPlaying ||
      this.props.tempo !== nextProps.tempo ||
      this.props.loopIsEnabled !== nextProps.loopIsEnabled ||
      this.props.connectedDevices !== nextProps.connectedDevices
    );
  }

  componentDidUpdate() {
    const { tempo, track, isPhone, onSelectTempo } = this.props;

    if (track.name !== undefined && !this.isTracking) {
      this.isTracking = true;
      startSMARTFretboard(track.name);

      // set tempo to 1.0 if we're phone and in STEP mode
      if (isPhone && tempo === 0) {
        onSelectTempo(1.0);
      }
    }

    if (track.name === undefined && this.isTracking) {
      this.isTracking = false;
      trackSMARTFretboard(true);
    }
  }
}

SmartFretModal.propTypes = {
  track: PropTypes.object,
  mediaId: PropTypes.string.isRequired,
  mediaTitle: PropTypes.string.isRequired,
  artist: PropTypes.string.isRequired,
  artworkURL: PropTypes.string.isRequired,
  trackCount: PropTypes.number.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  isPhone: PropTypes.bool.isRequired,
  isCompact: PropTypes.bool.isRequired,
  leftHandState: PropTypes.bool.isRequired,
  currentNotation: PropTypes.string.isRequired,
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
  onSeekStart: PropTypes.func,
  onSeek: PropTypes.func,
  onSeekEnd: PropTypes.func,
  onMarkerPress: PropTypes.func.isRequired,
  onMarkerLongPress: PropTypes.func.isRequired,
  onLoopEnable: PropTypes.func.isRequired,
  onLoopBegin: PropTypes.func.isRequired,
  onLoopEnd: PropTypes.func.isRequired,
  onSetCurrentLoop: PropTypes.func.isRequired,
  onClearCurrentLoop: PropTypes.func.isRequired,
  onPrevStep: PropTypes.func.isRequired,
  onNextStep: PropTypes.func.isRequired,
  onDisplayInfo: PropTypes.func.isRequired,
  clearSmartTrack: PropTypes.func.isRequired,
  onToggleFretlightAdmin: PropTypes.func.isRequired,
  onToggleLibrary: PropTypes.func,
  onSelectTempo: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    track: state.get("smartTrack"),
    leftHandState: state.get("leftHandState"),
    currentNotation: state.get("currentNotation")
  };
};

export default connect(mapStateToProps, actions)(SmartFretModal);
