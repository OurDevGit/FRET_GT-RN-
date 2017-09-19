import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import PropTypes from "prop-types";
import Dimensions from "Dimensions";

import RNFetchBlob from "react-native-fetch-blob";

import PlaybackVideoPrimary from "./PlaybackVideoPrimary";
import PlaybackTimeline from "./PlaybackTimeline";
import PlaybackSecondary from "./PlaybackSecondary";
import { FullVideoModal } from "../modals";
import { playerBackground } from "../../design";

import VideoOverlay from "./VideoOverlay";
import Midi from "./Midi";

import {
  loadMidi,
  clearMidi,
  allChapters,
  chapterForTime,
  allMarkers,
  markerForTime,
  midiForTime,
  midiOffsetForTime
} from "../../selectors";

class Vid extends React.Component {
  state = {
    isPlaying: false,
    mediaDuration: 0,
    playbackProgress: 0.0,
    playbackSeconds: 0.0,
    playbackRate: 1,
    videoRate: 1,
    seek: -1,
    videoUri: null,
    paused: false,
    naturalSize: { height: 240, width: 320 },
    chapters: [],
    currentChapter: {},
    markers: [],
    currentMarker: {},
    midiFiles: [],
    currentMidiFile: null,
    title: "Loading...",
    quickLoops: [],
    midiFile: null,
    isFullscreen: false
  };

  render() {
    const mediaTitle =
      this.props.song !== undefined ? this.props.song.name : "";
    const mediaId = this.props.song !== undefined ? this.props.song.midi : "";
    const savedLoops = this.props.loops === undefined ? [] : this.props.loops;
    const isPhone = Dimensions.get("window").height < 500;
    const markers = allChapters();
    console.log("markers", markers);

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#000",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: playerBackground,
          margin: 4,
          padding: 2,
          borderRadius: 6
        }}
      >
        <Midi
          midi={this.state.currentMidiFile}
          onData={this.props.updateMidiData}
          clearMidiData={this.props.clearMidiData}
          clearMidi={clearMidi}
          loadMidi={loadMidi}
        />

        {isPhone || this.state.isFullscreen ? (
          <FullVideoModal
            mediaId={mediaId}
            mediaTitle={mediaTitle}
            trackCount={this.props.trackCount}
            isPlaying={this.state.isPlaying}
            isCompact={isCompact}
            isPhone={isPhone}
            progress={this.state.playbackProgress}
            duration={this.state.mediaDuration}
            markers={markers}
            currentLoop={this.props.currentLoop}
            loopIsEnabled={this.props.loopIsEnabled}
            tempo={this.state.playbackRate}
            connectedDevices={this.props.connectedDevices}
            onPreviousPress={this.handlePreviousPress}
            onBackPress={this.handleBackPress}
            onPlayPausePress={this.handlePlayPausePress}
            onForwardPress={this.handleForwardPress}
            onNextPress={this.handleNextPress}
            onSeek={this.handleSeek}
            onMarkerPress={this.handleMarkerPress}
            onMarkerLongPress={this.handleMarkerLongPress}
            onSelectTempo={this.handleSelectTempo}
            onLoopEnable={this.handleLoopEnable}
            onLoopBegin={this.handleLoopBegin}
            onLoopEnd={this.handleLoopEnd}
            onSetCurrentLoop={this.handleSetCurrentLoop}
            onClearCurrentLoop={this.props.clearCurrentLoop}
            onPrevStep={this.handlePrevStep}
            onNextStep={this.handleNextStep}
            onDisplayInfo={this.handleDisplayInfoAlert}
          />
        ) : (
          <View style={{ flex: 1 }}>
            <PlaybackVideoPrimary
              mediaId={mediaId}
              title={mediaTitle}
              tempo={this.state.playbackRate}
              progress={this.state.playbackProgress}
              duration={this.state.mediaDuration}
              markers={markers}
              isPlaying={this.state.isPlaying}
              isPhone={isPhone}
              onVideoLoad={this.handleVideoLoad}
              onProgress={this.handleProgress}
              onEnd={this.handleEnd}
              onError={this.handleError}
              onPlayerRegister={this.handlePlayerRegister}
              onPreviousPress={this.handlePreviousPress}
              onBackPress={this.handleBackPress}
              onPlayPausePress={this.handlePlayPausePress}
              onForwardPress={this.handleForwardPress}
              onNextPress={this.handleNextPress}
              onMarkerPress={this.handleMarkerPress}
            />
            {/* <PlaybackTimeline
              progress={this.state.playbackProgress}
              duration={this.state.mediaDuration}
              currentLoop={this.props.currentLoop}
              loopIsEnabled={this.props.loopIsEnabled}
              onSeek={this.handleSeek}
              onMarkerPress={this.handleMarkerPress}
              onMarkerLongPress={this.handleMarkerLongPress}
              onLoopEnable={this.handleLoopEnable}
            /> */}
            {/* <PlaybackSecondary
              mediaId={mediaId}
              tempo={this.state.playbackRate}
              loopIsEnabled={this.props.loopIsEnabled}
              isPhone={isPhone}
              currentLoop={this.props.currentLoop}
              connectedDevices={this.props.connectedDevices}
              onSelectTempo={this.handleSelectTempo}
              onLoopEnable={this.handleLoopEnable}
              onLoopBegin={this.handleLoopBegin}
              onLoopEnd={this.handleLoopEnd}
              onSetCurrentLoop={this.handleSetCurrentLoop}
              onClearCurrentLoop={this.props.clearCurrentLoop}
              onPrevStep={this.handlePrevStep}
              onNextStep={this.handleNextStep}
              onDisplayInfo={this.handleDisplayInfoAlert}
            /> */}
          </View>
        )}
      </View>
    );
  }

  componentWillMount() {
    this.handleNewVideo();
  }

  componentWillReceiveProps(newProps) {
    this.handleNewVideo();
  }

  handlePlayerRegister = player => {
    this.player = player;
  };

  // DATA METHODS

  handleNewVideo = () => {
    this.loadJSON("config.json");

    this.setState({
      videoUri: RNFetchBlob.fs.asset("lesson.mp4")
    });
  };

  handleVideoLoad = details => {
    console.log("handleVideoLoad");
    this.setState({
      mediaDuration: details.duration,
      naturalSize: details.naturalSize
    });
  };

  loadJSON = fileName => {
    const path = RNFetchBlob.fs.asset(fileName);
    RNFetchBlob.fs
      .readFile(path, "utf8")
      .then(json => {
        const j = JSON.parse(json);

        this.setState({
          title: j.name || "",
          chapters: j.chapters || [],
          markers: allMarkers(j.chapters || []),
          midiFiles: j.midiTimes || [],
          quickLoops: j.quickLoops || []
        });
      })
      .catch(err => {
        console.error(err);
      });
  };

  // PROGRESS METHODS

  handleProgress = progress => {
    const { currentTime, playableDuration } = progress;
    const { loopIsEnabled, currentLoop, updateTime } = this.props;
    const { playbackProgress, seconds } = this.state;
    const currentProgress = currentTime / playableDuration;

    const currentChapter = chapterForTime(currentTime, this.state.chapters);
    const currentMarker = markerForTime(currentTime, this.state.markers);
    const currentMidi = midiForTime(currentTime, this.state.midiFiles);
    const currentMidiFile =
      currentMidi !== undefined ? `${currentMidi.name}.midi` : null;

    if (currentProgress != playbackProgress || currentTime !== seconds) {
      const loop = currentLoop.toJS() || { begin: -1, end: duration };

      if (loopIsEnabled && currentTime >= loop.end && loop.begin > -1) {
        this.setState({
          seek: loop.begin
        });
      } else {
        this.setState({
          mediaDuration: playableDuration,
          playbackSeconds: currentTime,
          playbackProgress: currentProgress,
          currentChapter,
          currentMarker,
          currentMidiFile,
          seek: -1
        });

        updateTime(currentTime);
      }
    }
  };

  // PLAYBACK METHODS

  handlePreviousPress = () => {
    const { markers } = this.props;
    const seconds = this.state.playbackSeconds;

    if (markers.count() === 0 || markers.first().time > seconds) {
      this.setState({
        seek: 0
      });
    } else {
      for (let marker of markers.reverse()) {
        if (marker.time + 1 < seconds) {
          this.setState({
            seek: marker.time
          });
          break;
        }
      }
    }
  };

  handleBackPress = () => {
    this.setState({
      seek: this.state.playbackSeconds - 5
    });
  };

  handlePlayPausePress = () => {
    this.setState({
      isPlaying: !this.state.isPlaying,
      musicRate: this.state.playbackRate
    });
  };

  handleForwardPress = () => {
    this.setState({
      seek: this.state.playbackSeconds + 30
    });
  };

  handleNextPress = marker => {
    const { markers } = this.props;
    const seconds = this.state.playbackSeconds;

    if (markers.count() === 0 || markers.last().time < seconds) {
      this.setState({
        seek: 0
      });
    } else {
      for (let marker of markers) {
        if (marker.time > seconds) {
          this.setState({
            seek: marker.time
          });
          break;
        }
      }
    }
  };

  // TIMELINE METHODS

  handleMarkerPress = time => {
    this.props.clearCurrentLoop();
    this.setState({
      seek: time
    });
  };

  handleSeek = progress => {
    const time = progress * this.state.mediaDuration;
    this.player.seek(time);
    this.setState({ seek: time });
  };

  // TEMPO METHODS

  handleSelectTempo = tempo => {
    this.props.onSelectTempo(tempo);
    this.setState({ playbackRate: tempo });
  };

  handleEnd = () => {
    console.log("video ended");
    this.setState({
      paused: true
    });

    this.player.seek(0);
  };

  handleError = err => {
    console.error(err);
  };

  handleVideoClose = () => {};
}

Vid.propTypes = {
  video: PropTypes.object,
  markers: PropTypes.object,
  updateMidiData: PropTypes.func.isRequired,
  clearMidiData: PropTypes.func.isRequired,
  updateTime: PropTypes.func.isRequired
};

export default Vid;
