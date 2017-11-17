import React from "react";
import PropTypes from "prop-types";
import { View, Image, Text, StyleSheet, NativeModules } from "react-native";
import FretboardLabels from "./AudioFretboardLabels";
import FretboardBackground from "./AudioFretboardBackground";
import FretboardStrings from "./AudioFretboardStrings";
var midiPlayer = NativeModules.GTMidiNotePlayer;
var noteInterval;

class AudioTuner extends React.Component {
  render() {
    const { currentNote, currentIndex, isBass } = this.props;
    const frets = [0, 1, 2, 3, 4, 5];

    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <FretboardLabels frets={frets} />
          <View style={{ flex: 1 }}>
            <FretboardBackground frets={frets} />
            <FretboardStrings
              currentString={5 - currentIndex}
              isBass={isBass}
            />
          </View>
        </View>
      </View>
    );
  }

  componentDidMount = () => {
    midiPlayer.start();
    this.playPitch(this.props.currentPitch);
  };

  componentWillUnmount = () => {
    midiPlayer.stop();
    clearInterval(noteInterval);
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentIndex !== this.props.currentIndex) {
      clearInterval(noteInterval);
      this.playPitch(nextProps.currentPitch);
    }
  }

  playPitch = pitch => {
    if (pitch !== undefined) {
      midiPlayer.play(pitch.index);
      noteInterval = setInterval(() => {
        midiPlayer.play(pitch.index);
      }, 2000);
    }
  };
}

AudioTuner.propTypes = {
  currentNote: PropTypes.string.isRequired,
  currentIndex: PropTypes.number.isRequired,
  isBass: PropTypes.bool.isRequired,
  currentPitch: PropTypes.object,
  fineTuning: PropTypes.number
};

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row", justifyContent: "center" },
  content: {
    height: "100%",
    aspectRatio: 1.5,
    backgroundColor: "#E6D9B9",
    padding: 15,
    borderWidth: 4,
    borderColor: "#777777"
  }
});

export default AudioTuner;
