import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Button, Text, StyleSheet } from "react-native";
import Video from "react-native-video";

import * as actions from "../../redux/actions";
import { loadMidi, clearMidi } from "../../selectors";
import { playerBackground } from "../../design";
import PlaybackPrimary from "./PlaybackPrimary";
import PlaybackTimeline from "./PlaybackTimeline";
import PlaybackSecondary from "./PlaybackSecondary";
import Music from "./Music";
import Midi from "./Midi";

const styles = StyleSheet.create({
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: 320,
    height: 240
  }
});

class MediaPlayer extends Component {
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
          song={this.props.song}
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

        {this.state.isVideo &&
          <Video
            ref={ref => {
              this.player = ref;
            }}
            rate={this.state.playbackRate}
            style={styles.backgroundVideo}
          />}

        <PlaybackTimeline
          progress={this.state.playbackProgress}
          duration={this.state.mediaDuration}
          markers={this.props.markers}
          onScrub={this.handleScrub}
          onMarkerPress={this.handleMarkerPress}
        />

        <PlaybackSecondary
          rate={this.state.playbackRate}
          handleRateChange={this.handleRateChange}
        />
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
    console.log(time);
    this.setState({
      seek: time
    });
  };

  // handleVideoProgress = progress => {
  //   const proportion = progress.currentTime / this.state.mediaDuration;
  //   this.setState({
  //     playbackProgress: proportion
  //   });
  // };

  // handleVideoLoad = videoDetails => {
  //   this.setState({
  //     mediaDuration: videoDetails.duration,
  //     isPlaying: true
  //   });
  // };

  handleScrub = progress => {
    if (this.state.isVideo === true) {
      this.videoPlayer.seek(progress * this.state.videoDuration);
    } else {
      if (this.songSound) {
        this.songSound.setCurrentTime(progress * this.songSound.getDuration());
      }
    }
  };

  handleRateChange = rate => {
    this.setState({
      playbackRate: rate
    });
  };
}

const mapStateToProps = (state, props) => {
  return {
    markers: state.get("markers")
  };
};

export default connect(mapStateToProps, actions)(MediaPlayer);
