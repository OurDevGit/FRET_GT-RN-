import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Button, Text, StyleSheet } from "react-native";
import Video from "react-native-video";
import Sound from "react-native-sound";

import * as actions from "../../redux/actions";
import { loadMidi } from "../../selectors";
import { playerBackground } from "../../design";
import PlaybackPrimary from "./PlaybackPrimary";
import PlaybackTimeline from "./PlaybackTimeline";
import PlaybackSecondary from "./PlaybackSecondary";

const prevSeconds = 0;

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
    playbackRate: 1
  };

  render() {
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
        <PlaybackPrimary
          title={this.props.song.name}
          isPlaying={this.state.isPlaying}
          handlePreviousPress={this.handlePreviousPress.bind(this)}
          handleBackPress={this.handleBackPress.bind(this)}
          handlePlayPausePress={this.handlePlayPausePress.bind(this)}
          handleForwardPress={this.handleForwardPress.bind(this)}
          handleNextPress={this.handleNextPress.bind(this)}
        />

        {this.state.isVideo &&
          <Video
            ref={ref => { this.player = ref; }}
            rate={this.state.playbackRate}
            style={styles.backgroundVideo}
          />
        }

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

  componentDidMount() {
    requestAnimationFrame(this.handleAnimationFrame);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.song.name !== this.props.song.name) {
      this.resetSong(newProps.song);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log(this.state);

    // if we're playing and the playback rate changed
    if (
      this.state.isPlaying &&
      prevState.playbackRate !== this.state.playbackRate
    ) {
      // music
      if (this.state.isVideo === false) {
        this.songSound.setSpeed(this.state.playbackRate);
      }

      // video
    }
  }

  resetSong = song => {
    if (this.songSound) {
      this.songSound.stop();
      this.songSound.release();
    }

    this.songSound = undefined;
    this.setState({ file: undefined, isPlaying: false, playbackProgress: 0 })

    this.loadMusic(song.audio)
    this.loadMidi(song.midi);
  };

  loadMidi = path => {
    loadMidi(path).then(midi => {
      this.props.updateMidiData(midi);
    });
  };

  loadMusic = audio => {
    this.songSound = new Sound(
      audio,
      Sound.MAIN_BUNDLE,
      (error, props) => {
        // console.log("sound init handler");
        if (error) {
          console.log("failed to load the sound", error);
          return;
        } else {
          this.setState({
            isPlaying: false,
            file: audio,
            mediaDuration: this.songSound.getDuration()
          });

          this.songSound.setSpeed(this.state.playbackRate);
        }
      }
    );
  }

  handlePreviousPress = () => {
    // TODO: hook up with markers
  };
  
  handleBackPress = () => {
    if (this.state.isVideo === false) {
      if (this.songSound) {
        this.songSound.getCurrentTime(seconds => {
          this.songSound.setCurrentTime(seconds - 5);
        });
      }
    } else {
      if (this.videoPlayer) {
        const currentSeconds = this.state.playbackProgress * this.state.mediaDuration;
        this.videoPlayer.seek(currentSeconds - 5);
      }
    }
  };

  handlePlayPausePress = () => {
    if (this.state.isVideo === false) {
      if (this.songSound) {
        if (this.state.isPlaying === true) {
          this.songSound.pause();
          this.setState({
            isPlaying: false
          });
        } else {
          console.log("playing song");
          this.songSound.play();
          this.setState({
            isPlaying: true
          });
        }
      } else {
        this.playMusic();
      }
    } else {
      // console.log()
      this.setState({
        isPlaying: !this.state.isPlaying
      });
    }
  };

  handleForwardPress = () => {
    if (this.state.isVideo === false) {
      if (this.songSound) {
        this.songSound.getCurrentTime(seconds => {
          this.songSound.setCurrentTime(seconds + 30);
        });
      }
    } else {
      if (this.videoPlayer) {
        const currentSeconds = this.state.playbackProgress * this.state.MediaDuration;
        this.videoPlayer.seek(currentSeconds + 30);
      }
    }
  };

  handleNextPress = marker => {
    if (this.songSound) {
      console.log(marker.time)
      this.songSound.setCurrentTime(marker.time);
    }
  };

  handleMarkerPress = marker => {
    if (this.songSound) {
      this.songSound.setCurrentTime(marker.time);
    }
  }

  handleVideoProgress = progress => {
    const proportion = progress.currentTime / this.state.mediaDuration;
    this.setState({
      playbackProgress: proportion
    });
  };

  handleVideoLoad = videoDetails => {
    this.setState({
      mediaDuration: videoDetails.duration,
      isPlaying: true
    });
  };

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
    console.log(`new rate: ${rate}`);
    this.setState({
      playbackRate: rate
    });
  };

  handleAnimationFrame = timestamp => {
    requestAnimationFrame(this.handleAnimationFrame);

    if (this.state.isVideo === false) {
      if (this.songSound) {
        this.songSound.getCurrentTime(seconds => {
          this.setState({
            playbackProgress: seconds / this.songSound.getDuration()
          });
          if (seconds !== prevSeconds) {
            this.props.updateTime(seconds);
            prevSeconds = seconds;
          }
        });
      }
    }
  };
}

const mapStateToProps = (state, props) => {
  return {
    markers: state.get("markers")
  };
};

export default connect(mapStateToProps, actions)(MediaPlayer);
