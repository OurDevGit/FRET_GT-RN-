import React from "react";
import PropTypes from "prop-types";
import { View, Image, Text, StyleSheet } from "react-native";
import Recorder from "react-native-recording";
import PitchFinder from "pitchfinder";
import DigitalLight from "./DigitalLight";
import DigitalNeedle from "./DigitalNeedle";

class DigitalTuner extends React.Component {
  constructor(props) {
    super(props);

    this.middleA = 440;
    this.semitone = 69;
    this.notations = [
      "C",
      "C♯",
      "D",
      "D♯",
      "E",
      "F",
      "F♯",
      "G",
      "G♯",
      "A",
      "A♯",
      "B"
    ];
    this.sampleRate = 22050; // FM radio
    this.buffer = 2048;
    this.pitchFinder = new PitchFinder.YIN({ sampleRate: this.sampleRate });
  }

  render() {
    const { currentNote } = this.props;
    return (
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={require("../../images/tuner-background.png")}
          resizeMode="contain"
        />

        <DigitalLight type={"left"} isOn={true} />
        <DigitalLight type={"right"} isOn={false} />
        <DigitalNeedle rotation={0} />
        <Image
          style={styles.housing}
          source={require("../../images/tuner-housing.png")}
          resizeMode="contain"
        />
      </View>
    );
  }

  componentDidMount = () => {
    Recorder.init(this.sampleRate, this.buffer);
    Recorder.start();
    Recorder.on("recording", data => {
      this.handleData(data);
    });
  };

  handleData = data => {
    const frequency = this.pitchFinder(data);

    if (frequency) {
      const note = this.getNote(frequency);
      const cents = this.getCents(frequency, note);
      const octave = parseInt(note / 12) - 1;
      const name = this.notations[note % 12];

      console.log(note, cents, octave, name);
    }
  };

  getNote = frequency => {
    const note = 12 * (Math.log(frequency / this.middleA) / Math.log(2));
    return Math.round(note) + this.semitone;
  };

  getCents = (frequency, note) => {
    const standard = this.middleA * Math.pow(2, (note - this.semitone) / 12);
    return Math.floor(1200 * Math.log(frequency / standard) / Math.log(2));
  };
}

DigitalTuner.propTypes = {
  currentNote: PropTypes.string.isRequired,
  currentIndex: PropTypes.number.isRequired
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center" },
  image: {
    height: "100%",
    aspectRatio: 1.333,
    alignItems: "center"
  },
  housing: { position: "absolute", bottom: "10%" }
});

export default DigitalTuner;
