import React from "react";
import PropTypes from "prop-types";
import { View, Image, StyleSheet } from "react-native";
import Recorder from "react-native-recording";
import PitchFinder from "pitchfinder";
import DigitalLight from "./DigitalLight";
import DigitalNeedle from "./DigitalNeedle";
import { fineTuningAdjustment } from "./TuningPitch";
import background from "../../images/tuner-background.png";
import housing from "../../images/tuner-housing.png";

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
    rotation: 0,
    isHearingPitch: false
  };

  render() {
    const { rotation } = this.state;
    const leftIsOn = rotation <= -3 || (rotation > -3 && rotation < 3);
    const rightIsOn = rotation >= 3 || (rotation > -3 && rotation < 3);
    return (
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <Image
            style={styles.image}
            source={background}
            resizeMode="contain"
          />

          <DigitalLight
            type={"left"}
            isOn={leftIsOn && this.state.isHearingPitch}
          />
          <DigitalLight
            type={"right"}
            isOn={rightIsOn && this.state.isHearingPitch}
          />
          <DigitalNeedle rotation={rotation} />

          <Image style={styles.housing} source={housing} resizeMode="contain" />
        </View>
      </View>
    );
  }

  componentDidMount = () => {
    if (this.props.currentPitch !== undefined) {
      this.startRecording();
    }
  };

  componentWillUnmount = () => {
    Recorder.stop();
    this.isRecording = false;
  };

  componentWillReceiveProps = nextProps => {
    if (nextProps.currentPitch !== undefined && !this.isRecording) {
      this.startRecording();
    }
    this.frequencies = [];
  };

  startRecording = () => {
    Recorder.init(this.sampleRate, 2048);
    Recorder.start();
    Recorder.on("recording", data => {
      this.handleData(data);
    });
    this.isRecording = true;
    requestAnimationFrame(this.handleAnimationFrame);
  };

  handleData = data => {
    const { currentPitch, fineTuning } = this.props;
    const frequency = this.pitchFinder(data) || currentPitch.frequency;

    if (this.isRecording) {
      const isHearingPitch = this.pitchFinder(data) !== null;
      this.setState({ isHearingPitch });
    }

    this.frequencies.unshift(frequency);
    if (this.frequencies.length > 4) {
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
      var diff = this.currentRotation - this.state.rotation;
      diff = Math.max(diff, -4);
      diff = Math.min(diff, 4);

      let rotation = this.state.rotation + diff;
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
