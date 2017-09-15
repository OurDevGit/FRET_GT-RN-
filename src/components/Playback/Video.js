import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import PropTypes from "prop-types";

import RNFetchBlob from "react-native-fetch-blob";
import Video from "react-native-video";

import VideoOverlay from "./VideoOverlay";
import Midi from "./Midi";

import {
  loadMidi,
  clearMidi,
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
    midiFile: null
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#000",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Midi
          midi={this.state.currentMidiFile}
          onData={this.props.updateMidiData}
          clearMidiData={this.props.clearMidiData}
          clearMidi={clearMidi}
          loadMidi={loadMidi}
        />
        <Video
          ref={ref => {
            this.player = ref;
          }}
          style={{ width: 320, height: 240 }}
          source={require("../../lesson.mp4")}
          paused={this.state.paused}
          rate={this.state.playbackRate}
          resizeMode="stretch"
          onLoad={this.handleVideoLoad}
          onProgress={this.handleProgress}
          onEnd={this.handleEnd}
          onError={this.handleError}
          onTimedMetadata={metaData => console.log({ metaData })}
        />
        <View
          style={{
            position: "absolute",
            backgroundColor: "transparent",
            height: "100%",
            width: "100%"
          }}
        >
          <VideoOverlay
            id={this.props.video.id}
            title={this.state.title}
            chapters={this.state.chapters}
            currentChapter={this.state.currentChapter}
            onClose={this.handleVideoClose}
            markers={this.props.markers}
            onRateChange={this.handleSelectTempo}
            rate={this.state.playbackRate}
            duration={this.state.mediaDuration}
            progress={this.state.playbackProgress}
            onSeek={this.handleSeek}
            currentLoop={this.props.currentLoop}
          />
        </View>
      </View>
    );
  }

  componentWillMount() {
    this.handleNewVideo();
  }

  componentWillReceiveProps(newProps) {
    this.handleNewVideo();
  }

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
