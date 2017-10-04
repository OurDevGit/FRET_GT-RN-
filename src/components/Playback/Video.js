import React from "react";
import { connect } from "react-redux";
import { View, Alert, StyleSheet, TouchableOpacity, Text } from "react-native";
import PropTypes from "prop-types";
import Dimensions from "Dimensions";

import RNFetchBlob from "react-native-fetch-blob";

import PlaybackVideoPrimary from "./PlaybackVideoPrimary";
import PlaybackTimeline from "./PlaybackTimeline";
import PlaybackSecondary from "./PlaybackSecondary";
import { playerBackground } from "../../design";
import { chapterForTime, markerForTime } from "../../selectors";
import { BtnVideoExitFullScreen, BtnToggleFretboard } from "../StyleKit";
import { BtnChapterModal } from "../modals";

import Midi from "./Midi";

import {
  loadMidi,
  clearMidi,
  midiForTime,
  midiOffsetForTime
} from "../../selectors";

this.playbackSeconds = 0.0;
var controlFaderId = 0;

class Vid extends React.Component {
  state = {
    isPlaying: true,
    mediaDuration: 0,
    playbackRate: 1,
    videoRate: 1,
    videoUri: null,
    naturalSize: { height: 240, width: 320 },
    midiFiles: [],
    title: "Loading...",
    quickLoops: [],
    isFullscreen: false,
    areControlsVisible: true,
    isShowingModal: false
  };

  render() {
    const mediaTitle =
      this.props.video !== undefined ? this.props.video.name : "";
    const mediaId = this.props.video !== undefined ? this.props.video.id : "";
    const savedLoops = this.props.loops === undefined ? [] : this.props.loops;
    const isPhone = Dimensions.get("window").height < 500;
    const midiFile =
      this.props.currentVideoMidiFile.get("name") !== undefined
        ? `${this.props.currentVideoMidiFile.get("name")}.midi`
        : null;

    return (
      <View
        style={{
          flex: 1,
          alignContent: "center",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: this.state.isFullscreen ? "black" : playerBackground,
          margin: this.state.isFullscreen ? 0 : 4,
          paddingVertical: this.state.isFullscreen ? 0 : 4,
          paddingHorizontal: this.state.isFullscreen ? 0 : 12,
          borderRadius: this.state.isFullscreen ? 0 : 6
        }}
      >
        <Midi
          midi={midiFile}
          onData={this.props.updateMidiData}
          clearMidiData={this.props.clearMidiData}
          clearMidi={clearMidi}
          loadMidi={loadMidi}
        />

        <View style={{ width: "100%", height: "100%" }}>
          <PlaybackVideoPrimary
            mediaId={mediaId}
            title={mediaTitle}
            tempo={this.state.playbackRate}
            duration={this.state.mediaDuration}
            markers={this.props.videoChapters.toJS()}
            currentChapter={this.props.currentVideoChapter.toJS()}
            currentMarker={this.props.currentVideoMarker.toJS()}
            isPlaying={this.state.isPlaying}
            isPhone={isPhone}
            isFullscreen={this.state.isFullscreen}
            areControlsVisible={this.state.areControlsVisible}
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
            onDisplayControls={this.handleDisplayControls}
            onFullscreen={this.handleFullscreen}
          />

          {(this.state.areControlsVisible || !this.state.isFullscreen) && (
            <View
              style={{
                flex: -1,
                position: this.state.isFullscreen ? "absolute" : "relative",
                bottom: 0,
                width: "100%"
              }}
            >
              {this.state.isFullscreen && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    width: "100%",
                    height: 60,
                    paddingRight: 10,
                    paddingBottom: 10
                  }}
                >
                  <BtnVideoExitFullScreen
                    style={{
                      width: 50,
                      height: 50
                    }}
                    color={"#FFFFFF"}
                    onPress={this.handleFullscreen}
                  />
                </View>
              )}

              <View
                style={{
                  flex: -1,
                  width: "100%",
                  paddingBottom: 10,
                  backgroundColor: this.state.isFullscreen
                    ? "rgba(255, 255, 255, 0.85)"
                    : "rgba(0, 0, 0, 0)"
                }}
              >
                {this.state.isFullscreen && (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: "100%",
                      paddingHorizontal: 10,
                      height: 50
                    }}
                  >
                    <BtnChapterModal
                      videoMarkers={this.props.videoChapters.toJS()}
                      currentChapter={this.props.currentVideoChapter.toJS()}
                      currentMarker={this.props.currentVideoMarker.toJS()}
                      onDisplayToggle={this.handleModalToggle}
                      onMarkerPress={this.handleMarkerPress}
                    />
                    <BtnToggleFretboard
                      style={{
                        width: 50,
                        height: 50
                      }}
                      color={"#FFFFFF"}
                      onPress={this.handleToggleFretboards}
                    />
                  </View>
                )}

                <PlaybackTimeline
                  duration={this.state.mediaDuration}
                  currentLoop={this.props.currentLoop}
                  loopIsEnabled={this.props.loopIsEnabled}
                  videoMarkers={this.props.videoMarkers.toJS()}
                  currentVideoMarker={this.props.currentVideoMarker.toJS()}
                  isVideo={true}
                  isFullscreen={this.state.isFullscreen}
                  onSeek={this.handleSeek}
                  onLoopEnable={this.handleLoopEnable}
                />
                <PlaybackSecondary
                  mediaId={mediaId}
                  tempo={this.state.playbackRate}
                  loopIsEnabled={this.props.loopIsEnabled}
                  isPhone={isPhone}
                  isVideo={true}
                  isFullscreen={this.state.isFullscreen}
                  currentLoop={this.props.currentLoop}
                  quickLoops={this.state.quickLoops}
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
                  onDisplayToggle={this.handleModalToggle}
                />
              </View>
            </View>
          )}
        </View>
      </View>
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.isPlaying !== nextState.isPlaying ||
      this.state.mediaDuration !== nextState.mediaDuration ||
      this.state.playbackRate !== nextState.playbackRate ||
      this.state.videoRate !== nextState.videoRate ||
      this.state.videoUri !== nextState.videoUri ||
      this.state.naturalSize !== nextState.naturalSize ||
      this.props.videoChapters !== nextProps.videoChapters ||
      this.props.videoMarkers !== nextProps.videoMarkers ||
      this.props.videoMidiFiles !== nextProps.videoMidiFiles ||
      this.state.midiFiles !== nextState.midiFiles ||
      this.state.currentMidiFile !== nextState.currentMidiFile ||
      this.state.title !== nextState.title ||
      this.state.quickLoops !== nextState.quickLoops ||
      this.state.isFullscreen !== nextState.isFullscreen ||
      this.state.areControlsVisible !== nextState.areControlsVisible ||
      !this.props.currentVideoChapter.equals(nextProps.currentVideoChapter) ||
      !this.props.currentVideoMarker.equals(nextProps.currentVideoMarker) ||
      !this.props.currentVideoMidiFile.equals(nextProps.currentVideoMidiFile)
    );
  }

  componentWillMount() {
    this.handleNewVideo();
  }

  handlePlayerRegister = player => {
    this.player = player;
  };

  // DATA METHODS

  handleNewVideo = () => {
    this.loadJSON("config.json");

    if (this.state.videoUri !== RNFetchBlob.fs.asset("lesson.mp4")) {
      console.log("videoUri", RNFetchBlob.fs.asset("lesson.mp4"));
      this.setState({
        videoUri: RNFetchBlob.fs.asset("lesson.mp4")
      });
    }
  };

  handleVideoLoad = details => {
    console.log(details.duration);
    this.setState({
      mediaDuration: details.duration,
      naturalSize: details.naturalSize,
      isPlaying: false
    });
  };

  handleError = err => {
    console.error(err);
  };

  loadJSON = fileName => {
    this.handleDisplayControls();
    const path = RNFetchBlob.fs.asset(fileName);
    RNFetchBlob.fs
      .readFile(path, "utf8")
      .then(json => {
        const j = JSON.parse(json);

        this.props.setVideoChapters(j.chapters);
        this.props.setVideoMidiFiles(j.midiTimes);

        const quickLoops = j.quickLoops.map(loop => {
          return { name: loop.name, begin: loop.begin, end: loop.end };
        });

        this.setState({
          title: j.name || "",
          quickLoops: quickLoops
        });
      })
      .catch(err => {
        console.error(err);
      });
  };

  // PROGRESS METHODS

  handleProgress = progress => {
    const { currentTime, playableDuration } = progress;
    const {
      loopIsEnabled,
      currentLoop,
      updateTime,
      videoChapters
    } = this.props;
    const currentProgress = currentTime / playableDuration;

    this.updateChaptersAndMarkers(currentTime);

    if (currentTime !== this.playbackSeconds) {
      const loop = currentLoop.toJS() || { begin: -1, end: duration };

      if (loopIsEnabled && currentTime >= loop.end && loop.begin > -1) {
        this.player.seek(loop.begin);
      } else {
        if (
          playableDuration !== this.state.mediaDuration &&
          playableDuration > 0
        ) {
          this.setState({
            mediaDuration: playableDuration
          });
        }

        this.playbackSeconds = currentTime;
        updateTime(currentTime);
      }
    }
  };

  updateChaptersAndMarkers = time => {
    const {
      videoChapters,
      videoMidiFiles,
      currentVideoChapter,
      currentVideoMarker,
      currentVideoMidiFile
    } = this.props;

    const chapter = chapterForTime(time, videoChapters);
    const marker = markerForTime(time, videoChapters);
    const midi = midiForTime(time, videoMidiFiles);

    if (!chapter.equals(currentVideoChapter)) {
      this.props.setCurrentVideoChapter(chapter);
    }

    if (!marker.equals(this.props.currentVideoMarker)) {
      this.props.setCurrentVideoMarker(marker);
    }

    if (!midi.equals(this.props.currentVideoMidiFile)) {
      this.props.setCurrentVideoMidiFile(midi);
    }
  };

  goToTime = time => {
    this.player.seek(time);

    if (!this.state.isPlaying) {
      this.playbackSeconds = time;
      this.updateChaptersAndMarkers(time);
      this.props.updateTime(time);
    }
  };

  // PLAYBACK METHODS

  handlePreviousPress = () => {
    this.resetDisplayTimer();
    const { markers } = this.props;
    const seconds = this.playbackSeconds;

    if (markers.count() === 0 || markers.first().time > seconds) {
      this.goToTime(0);
    } else {
      for (let marker of markers.reverse()) {
        if (marker.time + 1 < seconds) {
          this.goToTime(marker.time);
          break;
        }
      }
    }
  };

  handleBackPress = () => {
    this.resetDisplayTimer();
    this.goToTime(this.playbackSeconds - 5);
  };

  handlePlayPausePress = () => {
    this.resetDisplayTimer();
    this.setState({
      isPlaying: !this.state.isPlaying,
      videoRate: this.state.playbackRate
    });
  };

  handleForwardPress = () => {
    this.resetDisplayTimer();
    this.goToTime(this.playbackSeconds + 30);
  };

  handleNextPress = marker => {
    this.resetDisplayTimer();
    const { markers } = this.props;
    const seconds = this.playbackSeconds;

    if (markers.count() === 0 || markers.last().time < seconds) {
      this.goToTime(0);
    } else {
      for (let marker of markers) {
        if (marker.time > seconds) {
          this.goToTime(marker.time);
          break;
        }
      }
    }
  };

  // TIMELINE METHODS

  handleMarkerPress = time => {
    console.log(time);
    //this.props.clearCurrentLoop();
    this.goToTime(time);
  };

  handleSeek = progress => {
    const time = progress * this.state.mediaDuration;
    this.goToTime(time);
  };

  // TEMPO METHODS

  handleSelectTempo = tempo => {
    this.props.onSelectTempo(tempo);
    this.setState({ playbackRate: tempo });
  };

  // LOOP METHODS

  handleLoopEnable = () => {
    this.props.enableLoop(!this.props.loopIsEnabled);
  };

  handleLoopBegin = () => {
    const begin = this.playbackSeconds;
    const end = this.props.currentLoop.get("end") || this.props.duration;

    var loop = this.props.currentLoop.set("begin", begin);
    loop = begin > end ? loop.delete("end") : loop;

    this.props.setCurrentLoop(loop);
  };

  handleLoopEnd = () => {
    const begin = this.props.currentLoop.get("begin") || this.props.duration;
    const end = this.playbackSeconds;

    var loop = this.props.currentLoop.set("end", end);
    loop = begin > end ? loop.set("begin", 0) : loop;

    this.props.setCurrentLoop(loop);
  };

  handleSetCurrentLoop = loop => {
    const begin = loop.get("begin");
    this.goToTime(begin);
    this.props.setCurrentLoop(loop);
  };

  // INFO

  handleDisplayInfoAlert = () => {
    Alert.alert(
      "UNLEASH THE REAL POWER OF GUITAR TUNES!",
      "The Fretlight Guitar lights fingering positions right on the neck of a real guitar. Everything you see in Guitar Tunes will light in real-time right under your fingers!"
    );
  };

  // STEP

  handlePrevStep = () => {
    const { visibleTracks, currentLoop, loopIsEnabled } = this.props;
    const time = timeForPrevStep(
      this.playbackSeconds,
      visibleTracks.first().get("name"),
      currentLoop,
      loopIsEnabled
    );

    this.goToTime(time);
  };

  handleNextStep = () => {
    const { visibleTracks, currentLoop, loopIsEnabled } = this.props;
    const time = timeForNextStep(
      this.playbackSeconds,
      visibleTracks.first().get("name"),
      currentLoop,
      loopIsEnabled
    );

    this.goToTime(time);
  };

  handleEnd = () => {
    this.setState({ isPlaying: false });
    this.goToTime(0);
  };

  handleVideoClose = () => {};

  handleFullscreen = () => {
    this.resetDisplayTimer();
    this.props.onToggleAd(this.state.isFullscreen);

    if (this.state.isFullscreen) {
      this.props.onToggleFretboards(true);
    }

    this.setState({ isFullscreen: !this.state.isFullscreen });
  };

  handleModalToggle = bool => {
    this.setState({ isShowingModal: bool });

    if (!bool) {
      this.resetDisplayTimer();
    }
  };

  handleToggleFretboards = bool => {
    this.resetDisplayTimer();
    this.props.onToggleFretboards(bool);
  };

  resetDisplayTimer = () => {
    controlFaderId += 1;
    var currentId = controlFaderId;
    this.setState({ areControlsVisible: true });

    setTimeout(() => {
      if (currentId === controlFaderId && !this.state.isShowingModal) {
        this.setState({ areControlsVisible: false });
      }
    }, 3000);
  };

  handleDisplayControls = () => {
    if (this.state.areControlsVisible) {
      this.setState({ areControlsVisible: false });
    } else {
      this.resetDisplayTimer();
    }
  };
}

Vid.propTypes = {
  video: PropTypes.object,
  markers: PropTypes.object,
  videoChapters: PropTypes.object,
  videoMarkers: PropTypes.object,
  videoMidiFiles: PropTypes.object,
  currentVideoChapter: PropTypes.object,
  currentVideoMarker: PropTypes.object,
  currentVideoMidiFile: PropTypes.object,
  updateMidiData: PropTypes.func.isRequired,
  clearMidiData: PropTypes.func.isRequired,
  updateTime: PropTypes.func.isRequired,
  setVideoChapters: PropTypes.func.isRequired,
  setVideoMidiFiles: PropTypes.func.isRequired,
  setCurrentVideoChapter: PropTypes.func.isRequired,
  setCurrentVideoMarker: PropTypes.func.isRequired,
  setCurrentVideoMidiFile: PropTypes.func.isRequired,
  onToggleAd: PropTypes.func.isRequired,
  onToggleFretboards: PropTypes.func.isRequired
};

const mapStateToProps = (state, props) => {
  return {
    markers: state.get("markers"),
    currentLoop: state.get("currentLoop"),
    loopIsEnabled: state.get("loopIsEnabled"),
    visibleTracks: state.get("visibleTracks"),
    videoChapters: state.get("videoChapters"),
    videoMarkers: state.get("videoMarkers"),
    videoMidiFiles: state.get("videoMidiFiles"),
    currentVideoChapter: state.get("currentVideoChapter"),
    currentVideoMarker: state.get("currentVideoMarker"),
    currentVideoMidiFile: state.get("currentVideoMidiFile")
  };
};

export default connect(mapStateToProps)(Vid);
