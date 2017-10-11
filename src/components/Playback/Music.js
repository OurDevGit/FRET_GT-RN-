import React from "react";
import { View } from "react-native";
import PropTypes from "prop-types";
import Sound from "react-native-sound";

var systemVolume = 0;

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

    // new volume
    if (newProps.volume !== this.props.volume) {
      if (this.songSound) {
        this.songSound.setSystemVolume(newProps.volume);
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

    requestAnimationFrame(this.handleAnimationFrame);
  };

  handleAnimationFrame = () => {
    if (this.songSound !== null) {
      requestAnimationFrame(this.handleAnimationFrame);
      this.songSound.getCurrentTime(seconds => {
        if (this.songSound !== null) {
          const progress = {
            currentTime: seconds,
            duration: this.songSound.getDuration()
          };
          this.props.onProgress(progress);
        }
      });

      this.songSound.getSystemVolume((val, volume) => {
        this.props.onGetVolume(volume);
      });

      this.props.on;
    }
  };
}

Music.propTypes = {
  rate: PropTypes.number.isRequired,
  isPlaying: PropTypes.bool,
  song: PropTypes.object,
  seek: PropTypes.number,
  volume: PropTypes.number,
  onProgress: PropTypes.func.isRequired,
  onData: PropTypes.func.isRequired,
  onGetVolume: PropTypes.func.isRequired
};

export default Music;
