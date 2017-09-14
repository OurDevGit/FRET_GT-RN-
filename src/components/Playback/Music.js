import React from "react";
import { View } from "react-native";
import PropTypes from "prop-types";
import Sound from "react-native-sound";

class Music extends React.Component {
  songSound = null;

  render() {
    return <View />;
  }

  componentDidMount() {
    requestAnimationFrame(this.handleAnimationFrame);
    this.resetSong(this.props.song);
  }

  componentWillUnmount() {
    console.debug("Music did unmount");
    this.resetSong();
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
    if (newProps.seek !== this.props.seek && newProps.seek !== -1) {
      if (this.songSound) {
        this.songSound.setCurrentTime(newProps.seek);
      }
    }
  }

  setPlaying = isPlaying => {
    if (this.songSound) {
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

    if (song) {
      this.loadMusic(song.audio);
    }
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
      }
    });
  };

  handleAnimationFrame = () => {
    requestAnimationFrame(this.handleAnimationFrame);

    if (this.songSound) {
      this.songSound.getCurrentTime(seconds => {
        const progress = {
          currentTime: seconds,
          duration: this.songSound.getDuration()
        };
        this.props.onProgress(progress);
      });
    }
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
