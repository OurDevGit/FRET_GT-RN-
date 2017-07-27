import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import PropTypes from "prop-types";

import RNFetchBlob from "react-native-fetch-blob";
import Video from "react-native-video";

import VideoOverlay from "./VideoOverlay";
import Midi from "./Midi";

import { loadMidi, clearMidi } from "../../selectors";
import { allChapters, chapterFromTime } from "./ChapterSelectors.js";

class Vid extends React.Component {
  state = {
    isPlaying: false,
    mediaDuration: 0,
    playbackProgress: 0.0,
    playbackSeconds: 0.0,
    playbackRate: 1,
    seek: -1,
    videoUri: null,
    paused: false,
    naturalSize: { height: 240, width: 320 },
    chapters: [],
    currentChapter: {},
    midiTimes: [],
    title: "Loading...",
    quickLoops: [],
    mediaName: ""
  };

  render() {
    // const mediaTitle =
    //   this.props.video !== undefined ? this.props.video.name : "";

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#00f",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Midi
          midi={`${this.state.mediaName}.midi`}
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
            title={this.state.title}
            chapters={this.state.chapters}
            currentChapter={this.state.currentChapter}
            onClose={this.handleVideoClose}
            markers={this.props.markers}
            onRateChange={this.handleRateChange}
            rate={this.state.playbackRate}
            duration={this.state.mediaDuration}
            progress={this.state.playbackProgress}
            onSeek={this.handleSeek}
          />
        </View>
      </View>
    );
  }

  componentWillMount() {
    this.handleNewVideo();
  }

  componentWillReceiveProps(newProps) {
    // console.log(newProps);
    this.handleNewVideo();
  }

  loadJSON = fileName => {
    const path = RNFetchBlob.fs.asset(fileName);
    RNFetchBlob.fs
      .readFile(path, "utf8")
      .then(json => {
        const j = JSON.parse(json);

        this.setState({
          title: j.name || "",
          chapters: j.chapters,
          midiTimes: j.midiTimes || [],
          quickLoops: j.quickLoops || []
        });
      })
      .catch(err => {
        console.error(err);
      });
  };

  handleVideoClose = () => {};

  handleRateChange = rate => {
    this.setState({
      playbackRate: rate
    });
  };

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

  handleProgress = progress => {
    // const { currentTime, playableDuration } = progress.currentTime;
    const currentChapter = chapterFromTime(
      progress.currentTime,
      this.state.chapters
    );

    if (
      currentChapter.uniqueId &&
      currentChapter !== this.state.currentChapter
    ) {
      console.log("new chapter");

      if (currentChapter.mediaName) {
        console.log(currentChapter.mediaName);
      }
    }

    this.setState({
      mediaDuration: progress.playableDuration,
      playbackSeconds: progress.currentTime,
      playbackProgress: progress.currentTime / progress.playableDuration,
      currentChapter,
      mediaName: currentChapter.mediaName
    });

    this.props.updateTime(progress.currentTime);
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

  handleSeek = seconds => {
    console.log(`seeking to ${seconds}`);
    this.player.seek(seconds);
    this.setState({
      paused: false
    });
  };
}

Vid.propTypes = {
  video: PropTypes.object,
  markers: PropTypes.object,
  updateMidiData: PropTypes.func.isRequired,
  clearMidiData: PropTypes.func.isRequired,
  updateTime: PropTypes.func.isRequired
};

export default Vid;
