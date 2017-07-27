import React from "react";
import { View } from "react-native";
import PropTypes from "prop-types";

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
            onScrub={this.handleScrub}
            onMarkerPress={this.handleMarkerPress}
          />

          <PlaybackSecondary
            rate={this.state.playbackRate}
            onRateChange={this.handleRateChange}
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

  handleMusicProgress = (seconds, duration) => {
    const progress = seconds / duration;
    if (
      progress != this.state.playbackProgress ||
      seconds !== this.state.seconds
    ) {
      this.setState({
        playbackProgress: progress,
        playbackSeconds: seconds,
        seek: -1
      });

      this.props.updateTime(seconds);
    }
  };

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

  handleMarkerPress = time => {
    this.setState({
      seek: time
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
}

Song.propTypes = {
  song: PropTypes.object
};

export default Song;
