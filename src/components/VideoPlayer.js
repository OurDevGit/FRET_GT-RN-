import React, { PropTypes, Component } from "react";
import { View, Text, Button, StyleSheet } from "react-native";

import Video from "react-native-video";
import Sound from "react-native-sound";

class VideoPlayer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTime: 0,
      isPlayingVideo: true,
      isPlayingMusic: false
    };
  }

  render() {
    return (
      <View style={styles.backgroundVideo}>
        <Button
          onPress={this.handleToggleVideo}
          title={this.state.isPlayingVideo ? "Close Video" : "Play Video"}
        />
        <Button
          onPress={this.handleToggleMusic}
          title={this.state.isPlayingMusic ? "Stop Music" : "Play Song"}
        />
        {this.state.isPlayingVideo
          ? <Video
              source={require("../../test-small.mp4")}
              style={styles.backgroundVideo}
              rate={0.5}
            />
          : <View />}
      </View>
    );
  }

  handleProgress = progress => {
    this.setState({
      currentTime: progress.currentTime
    });
  };

  handleToggleVideo = () => {
    if (this.state.isPlayingMusic) {
      this.stopMusic();
    }

    this.setState({
      isPlayingVideo: !this.state.isPlayingVideo
    });
  };

  handleToggleMusic = () => {
    if (this.state.isPlayingMusic) {
      this.stopMusic();
    } else {
      this.playMusic();

      this.setState({
        isPlayingVideo: false
      });
    }
  };

  playMusic = () => {
    this.setState({
      isPlayingMusic: true
    });

    const file = require("../../test.m4a");
    console.log(file);

    this.song = new Sound(file, (error, props) => {
      if (error) {
        console.log("failed to load the sound", error);
        return;
      }
      // loaded successfully
      console.log(
        "duration in seconds: " +
          this.song.getDuration() +
          "number of channels: " +
          this.song.getNumberOfChannels()
      );

      this.setState({
        isPlayingMusic: true
      });

      this.song.setSpeed(1);
      this.song.play(success => {
        if (success) {
          console.log("successfully finished playing");
        } else {
          console.log("playback failed due to audio decoding errors");
        }

        this.setState({
          isPlayingMusic: false
        });
      });
    });
  };

  stopMusic = () => {
    this.song.stop();
    this.song.release();

    this.setState({
      isPlayingMusic: false
    });
  };
}

var styles = StyleSheet.create({
  backgroundVideo: {
    position: "absolute",
    top: 70,
    left: 0,
    width: 320,
    height: 240
    // bottom: 0,
    // right: 0
  }
});

export default VideoPlayer;
