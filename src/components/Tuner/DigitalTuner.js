import React from "react";
import PropTypes from "prop-types";
import { View, Image, Text, StyleSheet } from "react-native";
import Recorder from "react-native-recording";
import PitchFinder from "pitchfinder";
import DigitalLight from "./DigitalLight";
import DigitalNeedle from "./DigitalNeedle";
import { fineTuningAdjustment } from "./TuningPitch";

class DigitalTuner extends React.Component {
  constructor(props) {
    super(props);

    this.isRecording = false;
    this.sampleRate = 22050;
    this.frequencies = [];
    this.currentRotation = 0;
    this.pitchFinder = new PitchFinder.YIN({ sampleRate: this.sampleRate });
  }

  state = {
    rotation: 0
  };

  render() {
    const { currentNote } = this.props;
    const { rotation } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <Image
            style={styles.image}
            source={require("../../images/tuner-background.png")}
            resizeMode="contain"
          />

          <DigitalLight type={"left"} isOn={rotation < -3} />
          <DigitalLight type={"right"} isOn={rotation > 3} />
          <DigitalNeedle rotation={rotation} />

          <Image
            style={styles.housing}
            source={require("../../images/tuner-housing.png")}
            resizeMode="contain"
          />
        </View>
      </View>
    );
  }

  componentWillUnmount = () => {
    Recorder.stop();
    this.isRecording = false;
  };

  componentWillReceiveProps = nextProps => {
    if (nextProps.currentPitch !== undefined && !this.isRecording) {
      Recorder.init(this.sampleRate, 2048);
      Recorder.start();
      Recorder.on("recording", data => {
        this.handleData(data);
      });
      this.isRecording = true;
      requestAnimationFrame(this.handleAnimationFrame);
    }
    this.frequencies = [];
  };

  handleData = data => {
    const { currentPitch, fineTuning } = this.props;
    const frequency = this.pitchFinder(data) || currentPitch.frequency;

    this.frequencies.unshift(frequency);
    if (this.frequencies.length > 10) {
      this.frequencies.pop();
    }

    let adjustment = fineTuningAdjustment(currentPitch.frequency, fineTuning);
    let median = this.getMedianFrequency();
    let diff = median - currentPitch.frequency - adjustment;

    var rotation = diff * 5;
    rotation = Math.min(rotation, 60);
    rotation = Math.max(rotation, -60);
    this.currentRotation = rotation;
  };

  getMedianFrequency = () => {
    var values = [...this.frequencies];
    values.sort((a, b) => a - b);
    return (values[(values.length - 1) >> 1] + values[values.length >> 1]) / 2;
  };

  handleAnimationFrame = () => {
    if (this.isRecording) {
      let rotation =
        this.state.rotation + (this.currentRotation - this.state.rotation);
      this.setState({ rotation });
      requestAnimationFrame(this.handleAnimationFrame);
    }
  };
}

DigitalTuner.propTypes = {
  currentPitch: PropTypes.object,
  fineTuning: PropTypes.number
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center" },
  innerContainer: {
    height: "100%",
    aspectRatio: 1.333,
    alignItems: "center"
  },
  image: {
    height: "100%",
    aspectRatio: 1.333
  },
  housing: { position: "absolute", bottom: "10%" }
});

export default DigitalTuner;
