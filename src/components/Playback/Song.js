import React from "react";
import { View, Alert, NativeModules } from "react-native";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Map } from "immutable";
import Dimensions from "Dimensions";

import PlaybackPrimary from "./PlaybackPrimary";
import PlaybackTimeline from "./PlaybackTimeline";
import PlaybackSecondary from "./PlaybackSecondary";
import PlaybackCompact from "./Compact";
import PlaybackTimelineCompact from "./Compact/Timeline";
import { SmartFretModal } from "../modals";

import Music from "./Music";
import Midi from "./Midi";
import { playerBackground } from "../../design";
var idleTimer = NativeModules.GTIdleTimerController;

import {
  loadMidi,
  clearMidi,
  timeForPrevStep,
  timeForNextStep
} from "../../midi-store";

const emptyArray = [];

class Song extends React.Component {
  state = {
    isVideo: false,
    isPlaying: false,
    isSeeking: false,
    mediaDuration: 0,
    playbackProgress: 0.0,
    playbackSeconds: 0.0,
    musicRate: 1,
    playbackRate: 1,
    seek: -1
  };

  render() {
    const mediaTitle =
      this.props.song !== undefined ? this.props.song.title : "";
    const artist = this.props.song !== undefined ? this.props.song.artist : "";
    const artworkURL =
      this.props.song !== undefined ? this.props.song.artworkURL : "";
    const mediaId = this.props.song !== undefined ? this.props.song.id : "";
    const isCompact = this.props.height > 10 && this.props.height < 144;
    const savedLoops =
      this.props.loops === undefined ? emptyArray : this.props.loops;
    const isPhone = Dimensions.get("window").height < 500;
    const isVideo = this.props.video !== undefined;

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: playerBackground,
          margin: isCompact ? 0 : 4,
          padding: isCompact ? 0 : 2,
          borderRadius: isCompact ? 0 : 6
        }}
      >
        <Music
          seek={this.state.seek}
          rate={this.state.musicRate}
          isPlaying={this.state.isPlaying}
          isSeeking={this.state.isSeeking}
          song={this.props.song}
          volume={this.state.volume}
          onProgress={this.handleProgress}
          onData={this.handleMusicData}
          onGetVolume={this.handleGetVolume}
        />
        <Midi
          midi={this.getMidi()}
          onData={this.props.updateMidiData}
          clearMidiData={this.props.clearMidiData}
          clearMidi={clearMidi}
          loadMidi={loadMidi}
        />

        {isCompact ? (
          <View style={{ flex: 1 }}>
            <PlaybackCompact
              mediaId={mediaId}
              title={mediaTitle}
              trackCount={this.props.trackCount}
              isPlaying={this.state.isPlaying}
              isPhone={isPhone}
              isVideo={isVideo}
              tempo={this.state.playbackRate}
              loopIsEnabled={this.props.loopIsEnabled}
              currentLoop={this.props.currentLoop}
              onToggleLibrary={this.props.onToggleLibrary}
              onPreviousPress={this.handlePreviousPress}
              onBackPress={this.handleBackPress}
              onPlayPausePress={this.handlePlayPausePress}
              onForwardPress={this.handleForwardPress}
              onNextPress={this.handleNextPress}
              onLoopEnable={this.handleLoopEnable}
              onSetCurrentLoop={this.handleSetCurrentLoop}
              onClearCurrentLoop={this.props.clearCurrentLoop}
              onSelectTempo={this.handleSelectTempo}
            />
            <PlaybackTimelineCompact
              progress={this.state.playbackProgress}
              duration={this.state.mediaDuration}
              markers={this.props.markers}
              currentLoop={this.props.currentLoop}
              loopIsEnabled={this.props.loopIsEnabled}
              onSeekStart={this.handleSeekStart}
              onSeek={this.handleSeek}
              onSeekEnd={this.handleSeekEnd}
              onMarkerPress={this.handleMarkerPress}
              onMarkerLongPress={this.handleMarkerLongPress}
            />
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <PlaybackPrimary
              mediaId={mediaId}
              title={mediaTitle}
              artist={artist}
              artworkURL={artworkURL}
              isPlaying={this.state.isPlaying}
              isPhone={isPhone}
              onPreviousPress={this.handlePreviousPress}
              onBackPress={this.handleBackPress}
              onPlayPausePress={this.handlePlayPausePress}
              onForwardPress={this.handleForwardPress}
              onNextPress={this.handleNextPress}
            />
            <PlaybackTimeline
              progress={this.state.playbackProgress}
              duration={this.state.mediaDuration}
              markers={this.props.markers}
              currentLoop={this.props.currentLoop}
              loopIsEnabled={this.props.loopIsEnabled}
              onSeekStart={this.handleSeekStart}
              onSeek={this.handleSeek}
              onSeekEnd={this.handleSeekEnd}
              onMarkerPress={this.handleMarkerPress}
              onMarkerLongPress={this.handleMarkerLongPress}
              onLoopEnable={this.handleLoopEnable}
            />
            <PlaybackSecondary
              mediaId={mediaId}
              tempo={this.state.playbackRate}
              loopIsEnabled={this.props.loopIsEnabled}
              isPhone={isPhone}
              isVideo={false}
              isFullscreen={false}
              currentLoop={this.props.currentLoop}
              quickLoops={emptyArray}
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
              onToggleFretlightAdmin={this.handleToggleFretlightAdmin}
            />
          </View>
        )}
        <SmartFretModal
          mediaId={mediaId}
          mediaTitle={mediaTitle}
          trackCount={this.props.trackCount}
          isPlaying={this.state.isPlaying}
          isCompact={isCompact}
          isPhone={isPhone}
          progress={this.state.playbackProgress}
          duration={this.state.mediaDuration}
          markers={this.props.markers}
          currentLoop={this.props.currentLoop}
          loopIsEnabled={this.props.loopIsEnabled}
          tempo={this.state.playbackRate}
          connectedDevices={this.props.connectedDevices}
          onPreviousPress={this.handlePreviousPress}
          onBackPress={this.handleBackPress}
          onPlayPausePress={this.handlePlayPausePress}
          onForwardPress={this.handleForwardPress}
          onNextPress={this.handleNextPress}
          onSeekStart={this.handleSeekStart}
          onSeek={this.handleSeek}
          onSeekEnd={this.handleSeekEnd}
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
          onToggleFretlightAdmin={this.handleToggleFretlightAdmin}
        />
      </View>
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isPlaying !== prevState.isPlaying) {
      if (this.state.isPlaying) {
        idleTimer.stop();
      } else {
        idleTimer.start();
      }
    }
  }

  // SONG PARSING
  getMidi = () => {
    var midiFile = null;

    Object.keys(this.props.song.files).forEach(key => {
      const ext = key.split(".")[1];
      if (ext === "mid" || ext === "midi") {
        midiFile = this.props.song.files[key];
      }
    });

    return midiFile;
  };

  // getAudio

  // DATA METHODS

  handleMusicData = data => {
    this.setState({
      mediaDuration: data.duration,
      isPlaying: false
    });
  };

  goToTime = time => {
    // if we're playing, just seek the music player and let its progress update
    if (this.state.isPlaying) {
      this.setState({ seek: time });

      // if not, update time and handle loop
    } else {
      this.props.updateTime(time);
      const playbackProgress = time / this.state.mediaDuration;
      this.setState({ seek: time, playbackSeconds: time, playbackProgress });

      // disable loop if needed
      const loop = this.props.currentLoop.toJS() || {
        begin: -1,
        end: duration
      };
      if (time < loop.begin || time > loop) {
        this.props.enableLoop(false);
      }
    }
  };

  // PROGRESS

  handleProgress = progress => {
    if (this.state.isPlaying && !this.state.isSeeking) {
      const { currentTime, duration } = progress;
      const { loopIsEnabled, currentLoop, updateTime } = this.props;
      const { playbackProgress, seconds } = this.state;
      const currentProgress = currentTime / duration;
      if (currentProgress != playbackProgress || currentTime !== seconds) {
        const loop = currentLoop.toJS() || { begin: -1, end: duration };

        if (loopIsEnabled && currentTime >= loop.end && loop.begin > -1) {
          this.setState({
            seek: loop.begin
          });
        } else {
          this.setState({
            playbackProgress: currentProgress,
            playbackSeconds: currentTime,
            seek: -1
          });

          updateTime(currentTime);
        }
      }
    }
  };

  // PLAYBACK METHODS

  handlePreviousPress = () => {
    const { markers } = this.props;
    const seconds = this.state.playbackSeconds;

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
    this.goToTime(this.state.playbackSeconds - 5);
  };

  handlePlayPausePress = () => {
    if (this.props.countdownTimerState && !this.state.isPlaying) {
      this.props.onCountdownTimer(true);
      setTimeout(() => this.updatePlayback(), 3000);
    } else {
      this.updatePlayback();
    }
  };

  updatePlayback = () => {
    if (this.state.playbackRate === 0) {
      this.setState({
        isPlaying: true,
        musicRate: 1.0,
        playbackRate: 1.0
      });
    } else {
      this.setState({
        isPlaying: !this.state.isPlaying,
        musicRate: this.state.playbackRate
      });
    }
  };

  handleForwardPress = () => {
    this.goToTime(this.state.playbackSeconds + 30);
  };

  handleNextPress = marker => {
    const { markers } = this.props;
    const seconds = this.state.playbackSeconds;

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
    this.props.clearCurrentLoop();
    this.goToTime(time);
  };

  handleMarkerLongPress = (begin, end) => {
    const loop = Map({ begin, end });
    this.props.setCurrentLoop(loop);
    this.goToTime(begin);
  };

  handleSeekStart = () => {
    this.setState({ isSeeking: true });
    this.props.updateTime(-1);
  };

  handleSeek = progress => {
    this.setState({ seek: progress * this.state.mediaDuration });
  };

  handleSeekEnd = () => {
    this.setState({ isSeeking: false });
    this.goToTime(this.state.seek);
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
    this.props.enableLoop(!this.props.loopIsEnabled);
  };

  handleLoopBegin = () => {
    const begin = this.state.playbackSeconds;
    const end = this.props.currentLoop.get("end") || this.props.duration;

    var loop = this.props.currentLoop.set("begin", begin);
    loop = begin > end ? loop.delete("end") : loop;

    this.props.setCurrentLoop(loop);
  };

  handleLoopEnd = () => {
    const begin = this.props.currentLoop.get("begin") || this.props.duration;
    const end = this.state.playbackSeconds;

    var loop = this.props.currentLoop.set("end", end);
    loop = begin > end ? loop.set("begin", 0) : loop;

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
    const { playbackSeconds } = this.state;
    const { visibleTracks, currentLoop, loopIsEnabled } = this.props;
    const time = timeForPrevStep(
      playbackSeconds,
      visibleTracks.first().get("name"),
      currentLoop,
      loopIsEnabled
    );

    this.goToTime(time);
  };

  handleNextStep = () => {
    const { playbackSeconds } = this.state;
    const { visibleTracks, currentLoop, loopIsEnabled } = this.props;
    const time = timeForNextStep(
      playbackSeconds,
      visibleTracks.first().get("name"),
      currentLoop,
      loopIsEnabled
    );

    this.goToTime(time);
  };
}

Song.propTypes = {
  song: PropTypes.object,
  countdownTimerState: PropTypes.bool.isRequired,
  height: PropTypes.number,
  clearCurrentLoop: PropTypes.func,
  updateMidiData: PropTypes.func,
  clearMidiData: PropTypes.func,
  loopIsEnabled: PropTypes.bool,
  onToggleFretlightAdmin: PropTypes.func.isRequired,
  onCountdownTimer: PropTypes.func.isRequired
};

const mapStateToProps = (state, props) => {
  return {
    markers: state.get("markers"),
    currentLoop: state.get("currentLoop"),
    loopIsEnabled: state.get("loopIsEnabled"),
    visibleTracks: state.get("visibleTracks"),
    connectedDevices: state.get("guitars").count()
  };
};

export default connect(mapStateToProps)(Song);
