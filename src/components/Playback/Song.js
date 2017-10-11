import React from "react";
import { View, Alert } from "react-native";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Map } from "immutable";
import Dimensions from "Dimensions";
import { timeForPrevStep, timeForNextStep } from "../../selectors";

import PlaybackPrimary from "./PlaybackPrimary";
import PlaybackTimeline from "./PlaybackTimeline";
import PlaybackSecondary from "./PlaybackSecondary";
import PlaybackCompact from "./Compact";
import PlaybackTimelineCompact from "./Compact/Timeline";
import { SmartFretModal } from "../modals";

import Music from "./Music";
import Midi from "./Midi";
import { playerBackground } from "../../design";

import { loadMidi, clearMidi } from "../../selectors";

class Song extends React.Component {
  state = {
    isVideo: false,
    isPlaying: false,
    mediaDuration: 0,
    playbackProgress: 0.0,
    playbackSeconds: 0.0,
    musicRate: 1,
    playbackRate: 1,
    seek: -1,
    volume: 0.5,
    playbackVolume: 0.5,
    isSettingVolume: false
  };

  render() {
    const mediaTitle =
      this.props.song !== undefined ? this.props.song.name : "";
    const mediaId = this.props.song !== undefined ? this.props.song.midi : "";
    const isCompact = this.props.height < 150;
    const savedLoops = this.props.loops === undefined ? [] : this.props.loops;
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
          song={this.props.song}
          volume={this.state.volume}
          onProgress={this.handleProgress}
          onData={this.handleMusicData}
          onGetVolume={this.handleGetVolume}
        />
        <Midi
          midi={this.props.song.midi}
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
              onSeek={this.handleSeek}
              onMarkerPress={this.handleMarkerPress}
              onMarkerLongPress={this.handleMarkerLongPress}
            />
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <PlaybackPrimary
              mediaId={mediaId}
              title={mediaTitle}
              isPlaying={this.state.isPlaying}
              isPhone={isPhone}
              volume={this.state.playbackVolume}
              onPreviousPress={this.handlePreviousPress}
              onBackPress={this.handleBackPress}
              onPlayPausePress={this.handlePlayPausePress}
              onForwardPress={this.handleForwardPress}
              onNextPress={this.handleNextPress}
              onSetVolume={this.handleSetVolume}
              onSetVolumeComplete={this.handleSetVolumeComplete}
            />
            <PlaybackTimeline
              progress={this.state.playbackProgress}
              duration={this.state.mediaDuration}
              markers={this.props.markers}
              currentLoop={this.props.currentLoop}
              loopIsEnabled={this.props.loopIsEnabled}
              onSeek={this.handleSeek}
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
              quickLoops={[]}
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
      </View>
    );
  }

  // DATA METHODS

  handleMusicData = data => {
    this.setState({
      mediaDuration: data.duration,
      isPlaying: false
    });
  };

  // PROGRESS

  handleProgress = progress => {
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
    console.log("PAUSE");
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

  handleMarkerLongPress = (begin, end) => {
    const loop = Map({ begin, end });
    this.props.setCurrentLoop(loop);
    this.setState({ seek: begin });
  };

  handleSeek = progress => {
    this.setState({
      seek: progress * this.state.mediaDuration
    });
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
    this.setState({ seek: begin });
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
    const { playbackSeconds } = this.state;
    const { visibleTracks, currentLoop, loopIsEnabled } = this.props;
    const time = timeForPrevStep(
      playbackSeconds,
      visibleTracks.first().get("name"),
      currentLoop,
      loopIsEnabled
    );

    this.setState({ seek: time });
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

    this.setState({ seek: time });
  };

  handleGetVolume = volume => {
    if (volume !== this.state.volume && !this.state.isSettingVolume) {
      this.setState({ playbackVolume: volume });
    }
  };

  handleSetVolume = volume => {
    this.setState({ volume: volume, isSettingVolume: true });
  };

  handleSetVolumeComplete = volume => {
    this.setState({ playbackVolume: volume, isSettingVolume: false });
  };
}

Song.propTypes = {
  song: PropTypes.object,
  height: PropTypes.number,
  clearCurrentLoop: PropTypes.func,
  updateMidiData: PropTypes.func,
  clearMidiData: PropTypes.func,
  loopIsEnabled: PropTypes.bool
};

const mapStateToProps = (state, props) => {
  return {
    markers: state.get("markers"),
    currentLoop: state.get("currentLoop"),
    loopIsEnabled: state.get("loopIsEnabled"),
    visibleTracks: state.get("visibleTracks")
  };
};

export default connect(mapStateToProps)(Song);
