import React from "react";
import { View } from "react-native";
import PropTypes from "prop-types";

class Midi extends React.Component {
  render() {
    return <View />;
  }

  componentDidMount() {
    this.resetMidi(this.props.midi);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.midi !== this.props.midi) {
      console.debug({ newProps });
      this.resetMidi(newProps.midi);
    }
  }

  resetMidi = midi => {
    console.debug("resetting midi");
    this.props.clearMidiData();
    this.loadMidi(midi);
    this.props.clearMidi();
  };

  loadMidi = path => {
    console.debug("loading midi");
    console.debug({ path });
    this.props
      .loadMidi(path)
      .then(midi => {
        // console.debug({ midi });
        this.props.onData(midi);
      })
      .catch(err => {
        console.debug("error loading midi");
        console.debug(err);
      });
  };
}

Midi.propTypes = {
  loadMidi: PropTypes.func.isRequired,
  clearMidiData: PropTypes.func.isRequired,
  onData: PropTypes.func.isRequired,
  midi: PropTypes.string
};

export default Midi;
