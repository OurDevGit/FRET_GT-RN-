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

    this.hasStartedRecording = false;
    this.sampleRate = 22050;
    this.frequencies = [];
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
  };

  componentWillReceiveProps = nextProps => {
    if (nextProps.currentPitch !== undefined && !this.hasStartedRecording) {
      Recorder.init(this.sampleRate, 2048);
      Recorder.start();
      Recorder.on("recording", data => {
        this.handleData(data);
      });
      this.hasStartedRecording = true;
    }
    this.frequencies = [];
  };

  handleData = data => {
    const { currentPitch } = this.props;
    const frequency = this.pitchFinder(data) || currentPitch.frequency;

    this.frequencies.unshift(frequency);
    if (this.frequencies.length > 10) {
      this.frequencies.pop();
    }

    //console.log(frequency, currentPitch.note, currentPitch.frequency);

    let median = this.getMedianFrequency();
    let diff = median - currentPitch.frequency;

    var rotation = diff * 5;
    rotation = Math.min(rotation, 60);
    rotation = Math.max(rotation, -60);

    this.setState({ rotation });
  };

  getMedianFrequency = () => {
    var values = [...this.frequencies];
    values.sort((a, b) => a - b);
    return (values[(values.length - 1) >> 1] + values[values.length >> 1]) / 2;
  };
}

DigitalTuner.propTypes = {
  currentPitch: PropTypes.object
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
