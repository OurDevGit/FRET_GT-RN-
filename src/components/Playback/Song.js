import React from "react";
import { View } from "react-native";
import PropTypes from "prop-types";
import { Map } from "immutable";

import PlaybackPrimary from "./PlaybackPrimary";
import PlaybackTimeline from "./PlaybackTimeline";
import PlaybackSecondary from "./PlaybackSecondary";
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
    playbackRate: 1,
    seek: -1
  };

  render() {
    const mediaTitle =
      this.props.song !== undefined ? this.props.song.name : "";

    return (
      <View
        style={{
          flex: 1
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: playerBackground,
            margin: 4,
            padding: 2,
            borderRadius: 6
          }}
        >
          <Music
            seek={this.state.seek}
            rate={this.state.playbackRate}
            isPlaying={this.state.isPlaying}
            song={this.props.song}
            onProgress={this.handleMusicProgress}
            onData={this.handleMusicData}
          />
          <Midi
            midi={this.props.song.midi}
            onData={this.props.updateMidiData}
            clearMidiData={this.props.clearMidiData}
            clearMidi={clearMidi}
            loadMidi={loadMidi}
          />
          <PlaybackPrimary
            title={mediaTitle}
            isPlaying={this.state.isPlaying}
            handlePreviousPress={this.handlePreviousPress}
            handleBackPress={this.handleBackPress}
            handlePlayPausePress={this.handlePlayPausePress}
            handleForwardPress={this.handleForwardPress}
            handleNextPress={this.handleNextPress}
          />

          <PlaybackTimeline
            progress={this.state.playbackProgress}
            duration={this.state.mediaDuration}
            markers={this.props.markers}
            currentLoop={this.props.currentLoop}
            onScrub={this.handleScrub}
            onMarkerPress={this.handleMarkerPress}
            onMarkerLongPress={this.handleMarkerLongPress}
          />

          <PlaybackSecondary
            rate={this.state.playbackRate}
            loopIsEnabled={this.props.loopIsEnabled}
            onRateChange={this.handleRateChange}
            onLoopEnable={this.handleLoopEnable}
            onLoopBegin={this.handleLoopBegin}
            onLoopEnd={this.handleLoopEnd}
            onLoopSave={this.handleLoopSave}
            onDisplayLoops={this.handleDisplayLoops}
          />
        </View>
      </View>
    );
  }

  handleMusicData = data => {
    this.setState({
      mediaDuration: data.duration,
      isPlaying: false
    });
  };

  handleMusicProgress = (musicSeconds, duration) => {
    const { loopIsEnabled, currentLoop, updateTime } = this.props;
    const { playbackProgress, seconds } = this.state;
    const progress = musicSeconds / duration;
    if (progress != playbackProgress || musicSeconds !== seconds) {
      const loopBegin = currentLoop.get("begin") || -1;
      const loopEnd = currentLoop.get("end") || duration + 1;

      if (loopIsEnabled && musicSeconds >= loopEnd && loopBegin > -1) {
        this.setState({
          seek: loopBegin
        });
      } else {
        this.setState({
          playbackProgress: progress,
          playbackSeconds: musicSeconds,
          seek: -1
        });

        updateTime(musicSeconds);
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
      isPlaying: !this.state.isPlaying
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
    this.setState({
      seek: time
    });
  };

  handleMarkerLongPress = (begin, end) => {
    const loop = Map({ begin, end });
    this.props.setCurrentLoop(loop);
    this.setState({
      seek: begin
    });
  };

  handleScrub = progress => {
    this.setState({
      seek: progress * this.state.mediaDuration
    });
  };

  handleRateChange = rate => {
    this.setState({
      playbackRate: rate
    });
  };

  // LOOP METHODS

  handleLoopEnable = () => {
    this.props.enableLoop(!this.props.loopIsEnabled);
  };

  handleLoopBegin = () => {
    const loop = this.props.currentLoop.set(
      "begin",
      this.state.playbackSeconds
    );
    this.props.setCurrentLoop(loop);
  };

  handleLoopEnd = () => {
    const loop = this.props.currentLoop.set("end", this.state.playbackSeconds);
    this.props.setCurrentLoop(loop);
  };

  handleLoopSave = () => {};

  handleDisplayLoops = bool => {};
}

Song.propTypes = {
  song: PropTypes.object
};

export default Song;
