import React from "react";
import PropTypes from "prop-types";
import { View, Image, Text, StyleSheet } from "react-native";
import Recorder from "react-native-recording";
import PitchFinder from "pitchfinder";
import DigitalLight from "./DigitalLight";
import DigitalNeedle from "./DigitalNeedle";
var frequencies = [];

class DigitalTuner extends React.Component {
  constructor(props) {
    super(props);

    this.sampleRate = 22050;
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
    );
  }

  componentDidMount = () => {
    Recorder.init(this.sampleRate, 2048);
    Recorder.start();
    Recorder.on("recording", data => {
      this.handleData(data);
    });
  };

  handleData = data => {
    const { currentPitch } = this.props;
    const frequency = this.pitchFinder(data) || currentPitch.frequency;

    frequencies.unshift(frequency);
    if (frequencies.length > 10) {
      frequencies.pop();
    }

    console.log(currentPitch.note, currentPitch.frequency);
    let median = this.getMedianFrequency();
    let diff = median - currentPitch.frequency;

    var rotation = diff * 5;
    rotation = Math.min(rotation, 60);
    rotation = Math.max(rotation, -60);

    this.setState({ rotation });
  };

  getMedianFrequency = () => {
    var values = [...frequencies];
    values.sort((a, b) => a - b);
    return (values[(values.length - 1) >> 1] + values[values.length >> 1]) / 2;
  };
}

DigitalTuner.propTypes = {
  currentPitch: PropTypes.object.isRequired
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
