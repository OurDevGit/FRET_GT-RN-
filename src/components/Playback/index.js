import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Button, Text, Picker, StyleSheet } from "react-native";
import Video from "react-native-video";
import Sound from "react-native-sound";

import * as actions from "../../redux/actions";
import { loadMidi } from "../../selectors";
import { playerBackground } from "../../design";
import PlaybackPrimary from "./PlaybackPrimary";
import PlaybackTimeline from "./PlaybackTimeline";

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
    videoDuration: 0,
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
          handleMusicPress={this.handleMusicPress.bind(this)}
          handleVideoPress={this.handleVideoPress.bind(this)}
          title={this.props.song.name}
        />

        {this.state.isVideo
          ? <Video
              ref={ref => {
                this.player = ref;
              }}
              rate={this.state.playbackRate}
              //source={require("../../test-media/test-small.mp4")}
              style={styles.backgroundVideo}
            />
          : <View />}
        <View style={{ alignItems: "center" }}>
          {this.state.isVideo === true ? <View /> : <View />}
          <PlaybackTimeline
            progress={this.state.playbackProgress}
            onScrub={this.handleScrub}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around"
            }}
          >
            <View style={{ width: 100, height: 50 }}>
              <Picker
                selectedValue={this.state.playbackRate}
                onValueChange={this.handleRateChange}
                mode="dropdown"
              >
                <Picker.Item label="1x" value={1} />
                <Picker.Item label="0.25x" value={0.25} />
                <Picker.Item label="0.5x" value={0.5} />
              </Picker>
            </View>

            <Button title="-10" onPress={this.handleBackPress} />
            <Button
              title={this.state.isPlaying ? "Pause" : "Play"}
              onPress={this.handleTogglePress}
            />
            <Button title="+10" onPress={this.handleForwardPress} />
          </View>
        </View>
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
    this.setState({
      playbackProgress: 0
    });

    this.stopMusic();
    this.songSound = undefined;

    this.handleLoadMidi(song.midi);
  };

  handleBackPress = () => {
    if (this.state.isVideo === false) {
      if (this.songSound) {
        this.songSound.getCurrentTime(seconds => {
          this.songSound.setCurrentTime(seconds - 10);
        });
      }
    } else {
      if (this.videoPlayer) {
        const currentSeconds =
          this.state.playbackProgress * this.state.videoDuration;
        this.videoPlayer.seek(currentSeconds - 10);
      }
    }
  };

  handleForwardPress = () => {
    if (this.state.isVideo === false) {
      if (this.songSound) {
        this.songSound.getCurrentTime(seconds => {
          this.songSound.setCurrentTime(seconds + 10);
        });
      }
    } else {
      if (this.videoPlayer) {
        const currentSeconds =
          this.state.playbackProgress * this.state.videoDuration;
        this.videoPlayer.seek(currentSeconds + 10);
      }
    }
  };

  // TODO: integrate into library and remove
  handleMusicPress = () => {
    this.setState({
      isVideo: false,
      playbackRate: 1
    });

    this.playMusic();
  };

  // TODO: integrate into library and remove
  handleVideoPress = () => {
    this.setState({
      isVideo: true,
      playbackRate: 1,
      isPlaying: true
    });

    this.stopMusic();
  };

  handleTogglePress = () => {
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

  handleVideoProgress = progress => {
    const proportion = progress.currentTime / this.state.videoDuration;
    this.setState({
      playbackProgress: proportion
    });
  };

  handleVideoLoad = videoDetails => {
    this.setState({
      videoDuration: videoDetails.duration,
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

  handleLoadMidi = path => {
    loadMidi(path).then(midi => {
      this.props.updateMidiData(midi);
    });
  };

  playMusic = () => {
    // console.log("playMusic()");

    this.setState({
      isVideo: false
    });

    // const file = require("../test/dyer.m4a");
    // console.log("file: ", file);

    // console.log("playing");

    this.stopMusic();

    this.songSound = new Sound(
      this.props.song.audio,
      Sound.MAIN_BUNDLE,
      (error, props) => {
        console.log("sound init handler");

        if (error) {
          console.log("failed to load the sound", error);
          return;
        }
        // loaded successfully
        // console.log(
        //   "duration in seconds: " +
        //     this.songSound.getDuration() +
        //     "number of channels: " +
        //     this.songSound.getNumberOfChannels()
        // );

        this.setState({
          isPlaying: true
        });

        this.songSound.setSpeed(this.state.playbackRate);
        // console.log("playMusic playing");
        this.songSound.play(success => {
          if (success) {
            console.log("successfully finished playing");
          } else {
            console.log("playback failed due to audio decoding errors");
          }

          this.setState({
            isPlaying: false
          });
        });
      }
    );
  };

  stopMusic = () => {
    // console.log("stopMusic()");

    if (this.songSound) {
      this.songSound.stop();
      this.songSound.release();
    }

    if (this.state.isVideo === false) {
      this.setState({
        isPlaying: false
      });
    }
  };
}

export default connect(null, actions)(MediaPlayer);
