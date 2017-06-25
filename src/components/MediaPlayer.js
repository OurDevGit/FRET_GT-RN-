import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Button, Text, Picker } from "react-native";
import Video from "react-native-video";
import Sound from "react-native-sound";

import * as actions from "../redux/actions";
import PlaybackTimeline from "./PlaybackTimeline";
import MidiParser from "../midi-parser";

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
                isVideo: true,
                playbackRate: 1,
                isPlaying: true
              });

              this.stopMusic();
            }}
          />
          <Button
            title="Music"
            onPress={() => {
              this.setState({
                isVideo: false,
                playbackRate: 1
              });

              this.loadMidi("dyer.mid");
              this.playMusic();
            }}
          />
        </View>
        <View style={{ alignItems: "center" }}>
          {this.state.isVideo === true
            ? 
            <View />
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
    console.log("MediaPlayer did mount");
    requestAnimationFrame(this.handleAnimationFrame);
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
        this.song.setSpeed(this.state.playbackRate);
      }

      // video
    }
  }

  handleBackPress = () => {
    if (this.state.isVideo === false) {
      if (this.song) {
        this.song.getCurrentTime(seconds => {
          this.song.setCurrentTime(seconds - 10);
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
      if (this.song) {
        this.song.getCurrentTime(seconds => {
          this.song.setCurrentTime(seconds + 10);
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

  handleTogglePress = () => {
    console.log("toggle press");
    if (this.state.isVideo === false) {
      if (this.song) {
        if (this.state.isPlaying === true) {
          this.song.pause();
          this.setState({
            isPlaying: false
          });
        } else {
          console.log("playing song");
          this.song.play();
          this.setState({
            isPlaying: true
          });
        }
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
      if (this.song) {
        this.song.setCurrentTime(progress * this.song.getDuration());
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
      if (this.song) {
        this.song.getCurrentTime(seconds => {
          this.setState({
            playbackProgress: seconds / this.song.getDuration()
          });
        });
      }
    }
  };

  loadMidi = path => {
    MidiParser(path)
    .then(midi => {
      //this.props.updateMidiData(midi);
    })
  }

  playMusic = () => {
    console.log("playMusic()");

    this.setState({
      isVideo: false
    });

    // const file = require("../test/dyer.m4a");
    // console.log("file: ", file);

    this.stopMusic();

    this.song = new Sound("dyer_audio.m4a", Sound.MAIN_BUNDLE, (error, props) => {
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

      this.setState({
        isPlaying: true
      });

      this.song.setSpeed(this.state.playbackRate);
      console.log("playMusic playing");
      this.song.play(success => {
        if (success) {
          console.log("successfully finished playing");
        } else {
          console.log("playback failed due to audio decoding errors");
        }

        this.setState({
          isPlaying: false
        });
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

    if (this.state.isVideo === false) {
      this.setState({
        isPlaying: false
      });
    }
  };
}

export default connect(null, actions)(MediaPlayer);
