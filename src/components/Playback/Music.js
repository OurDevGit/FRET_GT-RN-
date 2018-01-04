import React from "react";
import { View, Alert } from "react-native";
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
    const oldId = this.props.song !== undefined ? this.props.song.mediaID : "";
    const newId = newProps.song !== undefined ? newProps.song.mediaID : "";

    if (oldId !== newId) {
      this.resetSong(newProps.song);
    }

    // new pause/play
    if (newProps.isPlaying !== this.props.isPlaying) {
      this.setPlaying(newProps.isPlaying);
    }

    // new seek
    if (newProps.isSeeking !== this.props.isSeeking) {
      if (newProps.isSeeking) {
        this.setPlaying(false);
      } else {
        this.setPlaying(newProps.isPlaying);
      }
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

  // SONG PARSING
  getAudio = song => {
    var audioFile = null;

    Object.keys(song.files).forEach(key => {
      const pathParts = key.split("/");
      const filename = pathParts[pathParts.length - 1];
      if (filename === "song.m4a") {
        audioFile = song.files[key];
      }
    });

    return audioFile;
  };

  getUrl = obj => {
    if (this.props.isPreview === true) {
      return `https://guitar-tunes-media-data.s3.amazonaws.com/${
        obj.mediaID
      }/preview.m4a`;
    } else {
      const file = this.getAudio(obj);
      return `http://localhost:8888${file}`;
    }
  };

  setPlaying = isPlaying => {
    if (this.songSound) {
      if (isPlaying === true) {
        this.songSound.setSpeed(this.props.rate).play();
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
      this.loadMusic(this.getUrl(song));
    }
  };

  loadMusic = url => {
    this.songSound = new Sound(url, Sound.MAIN_BUNDLE, error => {
      if (error) {
        Alert.alert(
          "Song Loading Error",
          "There was a problem loading this song. If this issue persists, please Archive the song in your library and download it again."
        );
        return;
      } else {
        if (this.songSound !== null) {
          const duration = this.songSound.getDuration();
          this.props.onData({
            duration
          });
          this.setState({
            mediaDuration: duration
          });
          this.setPlaying(this.props.isPlaying);
        }
      }
    });

    requestAnimationFrame(this.handleAnimationFrame);
  };

  handleAnimationFrame = () => {
    if (this.songSound !== null) {
      requestAnimationFrame(this.handleAnimationFrame);
      this.songSound.getCurrentTime(seconds => {
        if (this.songSound !== null) {
          const currentTime = seconds;
          const duration = this.songSound.getDuration();

          if (this.props.isPreview) {
            const fraction = currentTime / duration;
            if (fraction < 0.1) {
              this.songSound.setVolume(fraction * 10);
            } else if (fraction > 0.9) {
              this.songSound.setVolume((1 - fraction) * 10);
            } else {
              this.songSound.setVolume(1);
            }
          }

          const progress = {
            currentTime,
            duration
          };
          this.props.onProgress(progress);
        }
      });
    }
  };
}

Music.propTypes = {
  rate: PropTypes.number.isRequired,
  isPlaying: PropTypes.bool,
  isSeeking: PropTypes.bool,
  song: PropTypes.object,
  seek: PropTypes.number,
  onProgress: PropTypes.func.isRequired,
  onPlayEnd: PropTypes.func,
  onData: PropTypes.func.isRequired,
  isPreview: PropTypes.bool.isRequired
};

export default Music;
