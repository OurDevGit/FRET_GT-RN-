import React from "react";
import { Slider, NativeModules } from "react-native";
import PropTypes from "prop-types";

var volumeController = NativeModules.BSVolumeController;

class VolumeSlider extends React.Component {
  state = {
    volume: 0.5,
    playbackVolume: 0.5,
    isSettingVolume: false
  };

  render() {
    return (
      <Slider
        style={this.props.style}
        value={this.state.playbackVolume}
        onValueChange={this.handleSetVolume}
        onSlidingComplete={this.handleSetVolumeComplete}
      />
    );
  }

  componentDidMount() {
    volumeController.subscribe(this.handleGetVolume);
  }

  componentWillUnmount() {
    volumeController.unsubscribe();
  }

  handleGetVolume = volume => {
    if (!this.state.isSettingVolume) {
      this.setState({ playbackVolume: volume });
    }
  };

  handleSetVolume = volume => {
    volumeController.setVolume(volume);
    this.setState({ volume: volume, isSettingVolume: true });
  };

  handleSetVolumeComplete = volume => {
    this.setState({ playbackVolume: volume, isSettingVolume: false });
  };
}

VolumeSlider.propTypes = {
  style: PropTypes.object
};

export default VolumeSlider;
