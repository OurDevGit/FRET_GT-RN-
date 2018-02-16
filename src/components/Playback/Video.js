import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Dimensions from "Dimensions";
import RNFetchBlob from "react-native-fetch-blob";
import { Alert, NativeModules } from "react-native";
import { chapterForTime, markerForTime, midiForTime } from "../../selectors";
import VideoPresentation from "./VideoPresentation";
import {
  loadMidi,
  clearMidi,
  timeForPrevStep,
  timeForNextStep
} from "../../midi-store";
import { getIsPhone } from "../../utils";
import {
  trackFretlightInfoTap,
  trackFretlightStatusTap,
  startPlayback,
  stopPlayback,
  trackPlaybackPrevious,
  trackPlaybackRewind,
  trackPlaybackPlay,
  trackPlaybackForward,
  trackPlaybackNext,
  trackScrub,
  trackMarkerTap,
  trackChapterTap,
  trackLoopToggle,
  trackLoopLeft,
  trackLoopRight
} from "../../metrics";

var idleTimer = NativeModules.GTIdleTimerController;

var controlFaderId = 0;

class Vid extends React.Component {
  constructor(props) {
    super(props);

    this.playbackSeconds = 0.0;

    this.state = {
      isPlaying: false,
      mediaDuration: 0,
      playbackRate: 1,
      videoRate: 1,
      videoUri: null,
      naturalSize: { height: 240, width: 320 },
      midiFiles: [],
      title: "Loading...",
      quickLoops: [],
      isFullscreen: props.isShowingAd !== true,
      areControlsVisible: true,
      forceControlsVisible: false
    };
  }

  render() {
    const mediaTitle =
      this.props.video !== undefined ? this.props.video.title : "";
    const artist =
      this.props.video !== undefined ? this.props.video.artist : "";
    const artworkURL =
      this.props.video !== undefined ? this.props.video.artworkURL : "";

    const mediaId = this.props.video !== undefined ? this.props.video.id : "";
    const isPhone = getIsPhone();
    const midiFileName =
      this.props.currentVideoMidiFile.get("name") !== undefined
        ? `${this.props.currentVideoMidiFile.get("name")}.midi`
        : null;
    const midiFile = this.getMidiFile(midiFileName);

    return (
      <VideoPresentation
        mediaId={mediaId}
        title={mediaTitle}
        artist={artist}
        artworkURL={artworkURL}
        midiFile={midiFile}
        videoUri={this.state.videoUri}
        tempo={this.state.playbackRate}
        duration={this.state.mediaDuration}
        videoChapters={this.props.videoChapters.toJS()}
        videoMarkers={this.props.videoMarkers.toJS()}
        currentVideoChapter={this.props.currentVideoChapter.toJS()}
        currentVideoMarker={this.props.currentVideoMarker.toJS()}
        currentVideoMidiFile={midiFileName}
        quickLoops={this.state.quickLoops}
        connectedDevices={this.props.connectedDevices}
        currentLoop={this.props.currentLoop}
        isPlaying={this.state.isPlaying}
        isPhone={isPhone}
        isFullscreen={this.state.isFullscreen}
        areControlsVisible={this.state.areControlsVisible}
        loopIsEnabled={this.props.loopIsEnabled}
        onVideoLoad={this.handleVideoLoad}
        onLoadMidi={this.loadMidiName}
        onMidiData={this.props.updateMidiData}
        onClearMidi={clearMidi}
        onClearMidiData={this.props.clearMidiData}
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
        onSeekStart={this.handleSeekStart}
        onSeek={this.handleSeek}
        onSeekEnd={this.handleSeekEnd}
        onSelectTempo={this.handleSelectTempo}
        onLoopEnable={this.handleLoopEnable}
        onLoopBegin={this.handleLoopBegin}
        onLoopEnd={this.handleLoopEnd}
        onSetCurrentLoop={this.handleSetCurrentLoop}
        onClearCurrentLoop={this.props.clearCurrentLoop}
        onPrevStep={this.handlePrevStep}
        onNextStep={this.handleNextStep}
        onDisplayInfo={this.handleDisplayInfoAlert}
        onDisplayControls={this.handleDisplayControls}
        onForceControlsVisible={this.handleForceControlsVisible}
        onFullscreen={this.handleFullscreen}
        onToggleFretboards={this.handleToggleFretboards}
        onToggleFretlightAdmin={this.handleToggleFretlightAdmin}
      />
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
      this.props.loopIsEnabled !== nextProps.loopIsEnabled ||
      this.props.modalIsPresented !== nextProps.modalIsPresented ||
      this.props.appIsClosing !== nextProps.appIsClosing ||
      !this.props.currentLoop.equals(nextProps.currentLoop) ||
      !this.props.currentVideoChapter.equals(nextProps.currentVideoChapter) ||
      !this.props.currentVideoMarker.equals(nextProps.currentVideoMarker) ||
      !this.props.currentVideoMidiFile.equals(nextProps.currentVideoMidiFile)
    );
  }

  componentWillMount() {
    this.handleNewVideo();
  }

  componentWillUnmount() {
    this.goToTime(0);
  }

  componentDidUpdate(prevProps, prevState) {
    const prevId = prevProps.video.id || "";
    const currentId = this.props.video.id || "";

    if (prevId !== currentId) {
      this.goToTime(0);
    }

    if (this.state.isPlaying !== prevState.isPlaying) {
      if (this.state.isPlaying) {
        idleTimer.stop();
      } else {
        idleTimer.start();
      }
    }

    if (
      (this.props.modalIsPresented && !prevProps.modalIsPresented) ||
      (this.props.appIsClosing && !prevProps.appIsClosing)
    ) {
      this.setState({ isPlaying: false });
    }
  }

  handlePlayerRegister = player => {
    this.player = player;
  };

  // DATA METHODS

  findConfigFile = files => {
    var configFile = null;

    Object.keys(files).forEach(key => {
      const slashParts = key.split("/");
      const filename = slashParts[slashParts.length - 1];
      if (filename === "config.json") {
        configFile = files[key];
      }
    });

    return configFile;
  };

  findVideoFile = files => {
    var videoFile = null;

    Object.keys(files).forEach(key => {
      const slashParts = key.split("/");
      const filename = slashParts[slashParts.length - 1];
      if (filename === "lesson.mp4") {
        videoFile = files[key];
      }
    });

    return videoFile;
  };

  getMidiFile = midiName => {
    const fileKeys = Object.keys(this.props.video.files);
    const fileVals = Object.values(this.props.video.files);

    // we should clean things up a bit, but there a few spots where this gets called and sometimes it's already a valid filename
    if (fileVals.indexOf(midiName) !== -1) {
      return midiName;
    }

    var midiFile = null;
    fileKeys.forEach(fileKey => {
      const parts = fileKey.split("/");
      const keyFilename = parts[parts.length - 1];
      if (keyFilename === midiName) {
        midiFile = this.props.video.files[fileKey];
      }
    });

    return midiFile;
  };

  loadMidiName = midiName => {
    const midiFile = this.getMidiFile(midiName);
    return loadMidi(midiFile);
  };

  handleNewVideo = () => {
    const configFile = this.findConfigFile(this.props.video.files);
    this.loadJSON(configFile);

    const videoFile = this.findVideoFile(this.props.video.files);

    if (this.state.videoUri !== videoFile) {
      this.setState({
        videoUri: videoFile
      });
    }
  };

  handleVideoLoad = details => {
    this.setState({
      mediaDuration: details.duration,
      naturalSize: details.naturalSize,
      isPlaying: false
    });
  };

  handleError = err => {
    console.error(err);
  };

  loadJSON = path => {
    this.handleDisplayControls();
    RNFetchBlob.fs
      .readFile(path, "utf8")
      .then(json => {
        const configObject = JSON.parse(json);

        this.props.setVideoChapters(configObject.chapters);
        this.props.setVideoMidiFiles(configObject.midiTimes);

        const quickLoops = configObject.quickLoops.map(loop => {
          return { name: loop.name, begin: loop.begin, end: loop.end };
        });

        this.resetDisplayTimer();

        this.setState({
          title: configObject.name || "",
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
    const { loopIsEnabled, currentLoop, updateTime } = this.props;

    this.updateChaptersAndMarkers(currentTime);

    if (currentTime !== this.playbackSeconds) {
      const loop = currentLoop.toJS() || { begin: -1, end: playableDuration };

      if (loopIsEnabled && currentTime >= loop.end && loop.begin > -1) {
        this.player.seek(loop.begin);
      } else {
        if (
          playableDuration !== this.state.mediaDuration &&
          playableDuration > 1
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

  goToTime = time => {
    this.player.seek(time);

    if (!this.state.isPlaying) {
      this.playbackSeconds = time;
      this.updateChaptersAndMarkers(time);
      this.props.updateTime(time);
    }

    if (
      this.props.currentLoop.get("begin") !== undefined &&
      this.props.currentLoop.get("end")
    ) {
      if (
        time < this.props.currentLoop.get("begin") ||
        time > this.props.currentLoop.get("end")
      ) {
        this.props.enableLoop(false);
      }
    }
  };

  updateChaptersAndMarkers = time => {
    const { videoChapters, videoMidiFiles, currentVideoChapter } = this.props;

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

    if (midi.get("name") === undefined && this.state.playbackRate === 0) {
      this.setState({ playbackRate: 1.0 });
    }
  };

  // PLAYBACK METHODS

  handlePreviousPress = () => {
    trackPlaybackPrevious();
    this.resetDisplayTimer();
    const { videoChapters } = this.props;
    const seconds = this.playbackSeconds || 0;

    if (videoChapters.count() === 0 || videoChapters.last().time < seconds) {
      this.goToTime(0);
    } else {
      for (let chapter of videoChapters.reverse()) {
        if (chapter.begin + 1 < seconds) {
          this.goToTime(chapter.begin + 0.1);
          break;
        }
      }
    }
  };

  handleBackPress = () => {
    trackPlaybackRewind();
    this.resetDisplayTimer();
    this.goToTime(this.playbackSeconds - 5);
  };

  handlePlayPausePress = () => {
    trackPlaybackPlay();
    this.resetDisplayTimer();

    if (this.props.countdownTimerState && !this.state.isPlaying) {
      this.props.onCountdownTimer(true);
      setTimeout(() => this.updatePlayback(), 3000);
    } else {
      this.updatePlayback();
    }
  };

  updatePlayback = () => {
    if (this.state.playbackRate === 0) {
      startPlayback();
      this.setState({
        isPlaying: true,
        videoRate: 1.0,
        playbackRate: 1.0
      });
    } else {
      if (!this.state.isPlaying) {
        startPlayback();
      } else {
        stopPlayback();
      }
      this.setState({
        isPlaying: !this.state.isPlaying,
        videoRate: this.state.playbackRate
      });
    }
  };

  handleForwardPress = () => {
    trackPlaybackForward();
    this.resetDisplayTimer();
    this.goToTime(this.playbackSeconds + 30);
  };

  handleNextPress = () => {
    trackPlaybackNext();
    this.resetDisplayTimer();
    const { videoChapters } = this.props;
    const seconds = this.playbackSeconds || 0;

    if (videoChapters.count() === 0 || videoChapters.last().time < seconds) {
      this.goToTime(0);
    } else {
      for (let chapter of videoChapters) {
        if (chapter.begin > seconds) {
          this.goToTime(chapter.begin + 0.1);
          break;
        }
      }
    }
  };

  // TIMELINE METHODS

  handleMarkerPress = (type, time, name) => {
    if (type === "chapter") {
      trackChapterTap(name);
    } else {
      trackMarkerTap(name);
    }

    this.props.clearCurrentLoop();
    this.goToTime(time + 0.01);
  };

  handleSeekStart = () => {
    this.setState({ isSeeking: true });
    this.props.updateTime(-1);
  };

  handleSeek = progress => {
    trackScrub(progress);
    const time = progress * this.state.mediaDuration;
    this.goToTime(time);
  };

  handleSeekEnd = () => {
    this.setState({ isSeeking: false });
  };

  // TEMPO METHODS

  handleSelectTempo = tempo => {
    this.props.onSelectTempo(tempo);
    var newState = { playbackRate: tempo };

    if (this.state.isPlaying) {
      newState.musicRate = tempo;
    }

    if (tempo === 0) {
      newState.isPlaying = false;
    }

    this.setState(newState);
  };

  // LOOP METHODS

  handleLoopEnable = () => {
    trackLoopToggle(!this.props.loopIsEnabled);
    this.props.enableLoop(!this.props.loopIsEnabled);
  };

  handleLoopBegin = () => {
    const begin = this.playbackSeconds;
    const end = this.props.currentLoop.get("end") || this.state.mediaDuration;

    var loop = this.props.currentLoop.set("begin", begin);
    loop = begin > end ? loop.delete("end") : loop;

    trackLoopLeft(begin);
    this.props.setCurrentLoop(loop);
  };

  handleLoopEnd = () => {
    const begin =
      this.props.currentLoop.get("begin") || this.state.mediaDuration;
    const end = this.playbackSeconds;

    var loop = this.props.currentLoop.set("end", end);
    loop = begin > end ? loop.set("begin", 0) : loop;

    trackLoopRight(begin);
    this.props.setCurrentLoop(loop);
  };

  handleSetCurrentLoop = loop => {
    const begin = loop.get("begin");
    this.goToTime(begin);
    this.props.setCurrentLoop(loop);
  };

  // FRETLIGHT ADMIN

  handleToggleFretlightAdmin = () => {
    this.setState({ isPlaying: false });
    this.props.onToggleFretlightAdmin(true);
    trackFretlightStatusTap();
  };

  // INFO

  handleDisplayInfoAlert = () => {
    Alert.alert(
      "UNLEASH THE REAL POWER OF GUITAR TUNES!",
      "The Fretlight Guitar lights fingering positions right on the neck of a real guitar. Everything you see in Guitar Tunes will light in real-time right under your fingers!"
    );
    trackFretlightInfoTap();
  };

  // STEP

  handlePrevStep = () => {
    const {
      visibleTracks,
      currentLoop,
      loopIsEnabled,
      currentVideoMarker
    } = this.props;
    const time = timeForPrevStep(
      this.playbackSeconds,
      visibleTracks.first().get("name"),
      currentLoop,
      loopIsEnabled,
      currentVideoMarker
    );

    this.goToTime(time);
  };

  handleNextStep = () => {
    const {
      visibleTracks,
      currentLoop,
      loopIsEnabled,
      currentVideoMarker
    } = this.props;
    const time = timeForNextStep(
      this.playbackSeconds,
      visibleTracks.first().get("name"),
      currentLoop,
      loopIsEnabled,
      currentVideoMarker
    );

    this.goToTime(time);
  };

  handleEnd = () => {
    this.setState({ isPlaying: false });
    this.goToTime(0);
  };

  handleVideoClose = () => {};

  handleFullscreen = () => {
    const isPhone = getIsPhone();

    if (isPhone) {
      controlFaderId = -1;
      this.props.onClearMedia();
    } else {
      this.resetDisplayTimer();
      this.props.onToggleAd(this.state.isFullscreen);
      if (this.state.isFullscreen) {
        this.props.onToggleFretboards(true);
      }

      this.setState({ isFullscreen: !this.state.isFullscreen });
    }
  };

  handleForceControlsVisible = bool => {
    this.setState({ forceControlsVisible: bool });

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
      if (currentId === controlFaderId && !this.state.forceControlsVisible) {
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
  countdownTimerState: PropTypes.bool.isRequired,
  markers: PropTypes.object,
  videoChapters: PropTypes.object,
  videoMarkers: PropTypes.object,
  videoMidiFiles: PropTypes.object,
  currentVideoChapter: PropTypes.object,
  currentVideoMarker: PropTypes.object,
  currentVideoMidiFile: PropTypes.object,
  visibleTracks: PropTypes.object,
  connectedDevices: PropTypes.number.isRequired,
  modalIsPresented: PropTypes.bool.isRequired,
  appIsClosing: PropTypes.bool.isRequired,
  currentLoop: PropTypes.object,
  loopIsEnabled: PropTypes.bool.isRequired,
  updateMidiData: PropTypes.func.isRequired,
  clearMidiData: PropTypes.func.isRequired,
  updateTime: PropTypes.func.isRequired,
  setVideoChapters: PropTypes.func.isRequired,
  setVideoMidiFiles: PropTypes.func.isRequired,
  setCurrentVideoChapter: PropTypes.func.isRequired,
  setCurrentVideoMarker: PropTypes.func.isRequired,
  setCurrentVideoMidiFile: PropTypes.func.isRequired,
  onToggleAd: PropTypes.func.isRequired,
  onToggleFretboards: PropTypes.func.isRequired,
  onToggleFretlightAdmin: PropTypes.func.isRequired,
  onClearMedia: PropTypes.func.isRequired,
  onCountdownTimer: PropTypes.func.isRequired,
  enableLoop: PropTypes.func.isRequired,
  setCurrentLoop: PropTypes.func.isRequired,
  clearCurrentLoop: PropTypes.func.isRequired,
  onSelectTempo: PropTypes.func.isRequired,
  isShowingAd: PropTypes.bool.isRequired
};

const mapStateToProps = state => {
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
    currentVideoMidiFile: state.get("currentVideoMidiFile"),
    connectedDevices: state.get("guitars").count(),
    modalIsPresented: state.get("modalIsPresented"),
    appIsClosing: state.get("appIsClosing")
  };
};

export default connect(mapStateToProps)(Vid);
