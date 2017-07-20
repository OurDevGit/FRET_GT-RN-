import React from "react";
import { View, Text } from "react-native";
import PropTypes from "prop-types";
import Sound from "react-native-sound";

var songSound = null;

class Music extends React.Component {
  render() {
    const { rate, isPlaying, song } = this.props;
    return <View />;
  }

  componentDidMount() {
    requestAnimationFrame(this.handleAnimationFrame);
  }

  componentWillReceiveProps(newProps) {
    // new song
    const oldName = this.props.song !== undefined ? this.props.song.name : "";
    const newName = newProps.song !== undefined ? newProps.song.name : "";

    if (oldName !== newName) {
      this.resetSong(newProps.song);
    }

    // new pause/play
    if (newProps.isPlaying !== this.props.isPlaying) {
      this.setPlaying(newProps.isPlaying);
    }

    // new rate
    if (newProps.rate !== this.props.rate) {
      if (this.songSound) {
        this.songSound.setSpeed(newProps.rate);
      }
    }

    // new seek
    if (newProps.seek !== this.props.seek) {
      if (this.songSound) {
        this.songSound.setCurrentTime(newProps.seek);
      }
    }
  }

  componentWillUnmount() {
    console.log("Music will unmount!");
    console.log("Music will unmount!");
    console.log("Music will unmount!");
    console.log("Music will unmount!");
  }

  setPlaying = isPlaying => {
    if (this.songSound) {
      console.log("has sound object");
      if (isPlaying === true) {
        this.songSound.setSpeed(this.props.rate);
        this.songSound.play();
      } else {
        this.songSound.setSpeed(0);
        this.songSound.pause();
      }
    }
  };

  resetSong = song => {
    if (this.songSound) {
      this.songSound.stop();
      this.songSound.release();
      this.songSound = null;
    }

    this.loadMusic(song.audio);
  };

  loadMusic = audio => {
    this.songSound = new Sound(audio, Sound.MAIN_BUNDLE, (error, props) => {
      // console.log("sound init handler");
      if (error) {
        console.log("failed to load the sound", error);
        return;
      } else {
        const duration = this.songSound.getDuration();
        this.props.onData({
          duration
        });
        this.setState({
          file: audio,
          mediaDuration: duration
        });

        // this.songSound.setSpeed(this.state.playbackRate);
        // this.songSound.pause();
      }
    });
  };

  handleAnimationFrame = timestamp => {
    requestAnimationFrame(this.handleAnimationFrame);

    // if (this.state.isVideo === false) {
    if (this.songSound) {
      this.songSound.getCurrentTime(seconds => {
        this.props.onProgress(seconds, this.songSound.getDuration());
      });
    }
    // }
  };
}

Music.propTypes = {
  rate: PropTypes.number.isRequired,
  isPlaying: PropTypes.bool,
  song: PropTypes.object,
  onProgress: PropTypes.func.isRequired,
  onData: PropTypes.func.isRequired,
  seek: PropTypes.number
};

export default Music;
