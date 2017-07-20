import React from "react";
import { View, Text } from "react-native";
import PropTypes from "prop-types";

class Midi extends React.Component {
  render() {
    const { rate, isPlaying, song } = this.props;
    return <View />;
  }

  componentWillReceiveProps(newProps) {
    const oldName = this.props.song !== undefined ? this.props.song.name : "";
    const newName = newProps.song !== undefined ? newProps.song.name : "";

    if (oldName !== newName) {
      this.resetSong(newProps.song);
    }
  }

  resetSong = song => {
    // this.setState({
    //   file: undefined,
    //   isPlaying: false,
    //   playbackProgress: 0,
    //   mediaDuration: 0
    // });
    this.props.clearMidiData();
    this.loadMidi(song.midi);
    this.props.clearMidi();
  };

  loadMidi = path => {
    this.props.loadMidi(path).then(midi => {
      this.props.onData(midi);
    });
  };
}

Midi.propTypes = {
  loadMidi: PropTypes.func.isRequired,
  clearMidiData: PropTypes.func.isRequired,
  onData: PropTypes.func.isRequired,
  song: PropTypes.object
};

export default Midi;
