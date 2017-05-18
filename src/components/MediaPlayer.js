import React, { Component } from "react";
import { View, Button, Text, Picker } from "react-native";
import Video from "react-native-video";
import Sound from "react-native-sound";
import PlaybackTimeline from "./PlaybackTimeline";

class MediaPlayer extends Component {
  state = {
    isVideo: false,
    videoDuration: 0,
    playbackProgress: 0.0,
    playbackRate: 1
  };

  render() {
    return (
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around"
          }}
        >
          <Button
            title="Video"
            onPress={() => {
              this.setState({
                isVideo: true
              });

              this.stopMusic();
            }}
          />
          <Button
            title="Music"
            onPress={() => {
              this.setState({
                isVideo: false
              });

              this.playMusic();
            }}
          />
        </View>
        <View style={{ alignItems: "center" }}>
          {this.state.isVideo === true
            ? <Video
                ref={ref => {
                  this.videoPlayer = ref;
                }}
                source={require("../../test-small.mp4")}
                style={{
                  width: 200,
                  height: 112.5
                }}
                //progressUpdateInterval={2000}
                onLoad={this.handleVideoLoad}
                onProgress={this.handleVideoProgress}
                rate={0.5}
              />
            : <View />}
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
            <Button title="Toggle" onPress={this.handleForwardPress} />
            <Button title="+10" onPress={this.handleTogglePress} />
          </View>
        </View>
      </View>
    );
  }

  componentDidMount() {
    console.log("MediaPlayer did mount");
    requestAnimationFrame(this.handleAnimationFrame);
  }

  componentDidUpdate() {
    if (this.song) {
      this.song.setSpeed(this.state.playbackRate);
    }
  }

  handleBackPress = () => {};

  handleForwardPress = () => {};

  handleTogglePress = () => {};

  handleVideoProgress = progress => {
    const proportion = progress.currentTime / this.state.videoDuration;
    this.setState({
      playbackProgress: proportion
    });
  };

  handleVideoLoad = videoDetails => {
    this.setState({
      videoDuration: videoDetails.duration
    });
  };

  handleScrub = progress => {
    this.videoPlayer.seek(progress * this.state.videoDuration);
  };

  handleRateChange = rate => {
    console.log(`new rate: ${rate}`);
    this.setState({
      playbackRate: rate
    });
  };

  handleAnimationFrame = timestamp => {
    requestAnimationFrame(this.handleAnimationFrame);

    if (this.song) {
      this.song.getCurrentTime(seconds => {
        this.setState({
          playbackProgress: seconds / this.song.getDuration()
        });
      });
    }
  };

  playMusic = () => {
    console.log("playMusic()");

    this.setState({
      isVideo: false
    });

    // const file = require("../../tank.mp3");
    // console.log(file);

    this.stopMusic();

    this.song = new Sound("abc.m4a", Sound.MAIN_BUNDLE, (error, props) => {
      console.log("sound init handler");

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

      // this.setState({
      //   isPlayingMusic: true
      // });

      this.song.setSpeed(this.state.playbackRate);
      this.song.play(success => {
        if (success) {
          console.log("successfully finished playing");
        } else {
          console.log("playback failed due to audio decoding errors");
        }

        // this.setState({
        //   isPlayingMusic: false
        // });
      });
    });
  };

  stopMusic = () => {
    console.log("stopMusic()");

    if (this.song) {
      this.song.stop();
      this.song.release();
    } else {
      console.log("no song instance?!");
    }

    // this.setState({
    //   isPlayingMusic: false
    // });
  };
}

export default MediaPlayer;
