import React from "react";
import { Slider, NativeModules, DeviceEventEmitter } from "react-native";
import PropTypes from "prop-types";
import { trackPlaybackVolume } from "../../metrics";

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

  componentWillMount() {
    volumeController.subscribe();
    DeviceEventEmitter.addListener("VOLUME_CHANGE", this.handleGetVolume);
  }

  componentWillUnmount() {
    volumeController.unsubscribe();
    DeviceEventEmitter.removeListener("VOLUME_CHANGE", this.handleGetVolume);
  }

  handleGetVolume = volume => {
    if (!this.state.isSettingVolume) {
      trackPlaybackVolume(volume);
      this.setState({ playbackVolume: volume });
    }
  };

  handleSetVolume = volume => {
    volumeController.setVolume(volume);
    trackPlaybackVolume(volume);
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
