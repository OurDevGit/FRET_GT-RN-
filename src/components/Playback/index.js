import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Button, Text, Picker, StyleSheet } from "react-native";
import Video from "react-native-video";
import Sound from "react-native-sound";

import * as actions from "../../redux/actions";
import { loadMidi } from "../../selectors";
import { playerBackground } from "../../design";
import { getCurrentTime, getDuration, getProgress, setCurrentTime, setDuration, setProgress, clearTimeStore } from "../../time-store";

import PlaybackPrimary from "./PlaybackPrimary";
import PlaybackTimeline from "./PlaybackTimeline";

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
    playbackRate: 1,
    file: undefined
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
          duration={getDuration()}
          markers={this.props.markers}
          onScrub={this.handleScrub}
          onMarkerPress={this.handleMarkerPress}
        />

        <View style={{ alignItems: "center" }}>
          

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
              onPress={this.handlePlayPausePress}
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

    if (this.songSound) {
      this.songSound.stop();
      this.songSound.release();
    }

    this.songSound = undefined;
    this.setState({ file: undefined, isPlaying: false })
    clearTimeStore()

    this.loadMusic(song.audio)
    this.handleLoadMidi(song.midi);
  };

  handleLoadMidi = path => {
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
          setDuration(this.songSound.getDuration())

          this.setState({
            isPlaying: false,
            file: audio
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
        this.songSound.setCurrentTime(getCurrentTime() - 5);
      }
    } else {
      if (this.videoPlayer) {
        this.videoPlayer.seek(getCurrentTime() - 5);
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
          this.songSound.play();
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

  handleForwardPress = () => {
    if (this.state.isVideo === false) {
      if (this.songSound) {
        this.songSound.setCurrentTime(getCurrentTime() + 30);
      }
    } else {
      if (this.videoPlayer) {
        this.videoPlayer.seek(getCurrentTime() + 30);
      }
    }
  };

  handleNextPress = () => {
    // TODO: hook up with markers
  };

  handleMarkerPress = marker => {
    if (this.songSound) {
      console.log(marker.time)
      this.songSound.setCurrentTime(marker.time);
    }
  }

  handleVideoProgress = progress => {
    setProgress(progress)
  };

  handleVideoLoad = videoDetails => {
    setDuration(videoDetails.duration)
  };

  handleScrub = progress => {
    if (this.state.isVideo === true) {
      this.videoPlayer.seek(progress * getDuration());
    } else {
      if (this.songSound) {
        this.songSound.setCurrentTime(progress * getDuration());
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
          setCurrentTime(seconds);
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
