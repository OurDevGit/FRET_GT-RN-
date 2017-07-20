import React, { Component } from "react";
import PropTypes from 'prop-types';
import { View, Dimensions, Text } from "react-native";

import { PrimaryBlue } from "../../design"

import Playhead from "./Playhead";
import PlaybackMarkers from "./PlaybackMarkers";

class PlaybackTimeline extends Component {
  state = {
    layout: { width: 1 },
    containerLayout: { width: 1 },
    progress: this.props.progress,
    ignorePropsProgress: false
  };

  render() {
    const elapsed = this.formattedTime(this.props.duration * this.state.progress)
    const remaining = this.formattedTime(this.props.duration - (this.props.duration * this.state.progress))

    return (
      <View 
        style={{ flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "flex-start", marginHorizontal: 10, marginTop: 8, marginBottom: -10 }}
        onLayout={this.handleContainerLayout}
      >
        <PlaybackMarkers 
          left={this.state.layout.x}
          width={this.state.containerLayout.width}
          height={this.state.containerLayout.height - this.state.layout.height}
          duration={this.props.duration}
          markers={this.props.markers}
          onMarkerPress={this.props.onMarkerPress}
        />
        <Text style={{ width: 40, height: 20, marginHorizontal: 15, textAlign: "center" }}>{elapsed}</Text>
        <View style={{ flex: 1, height: 18 }} onLayout={this.handleLayout} >
          <View
            style={{
              position: "absolute",
              height: 1,
              width: "100%",
              backgroundColor: PrimaryBlue,
              top: 10,
              marginTop: -0.5
            }}
          />
        </View>
        <Playhead
          onPan={this.handlePlayheadPan}
          onPanStart={this.handlePlayheadPanStart}
          onPanEnd={this.handlePlayheadPanEnd}
          scrollLeft={this.state.progress * this.state.layout.width}
          containerLeft={this.state.layout.x - 9}
        />
        <Text style={{ width: 40, height: 20, marginHorizontal: 15, textAlign: "center" }}>{"-" + remaining}</Text>
      </View>
    );
  }

  componentWillReceiveProps(newProps) {
    if (newProps.progress != this.state.progress && this.state.ignorePropsProgress === false) {
      this.setState({ progress: newProps.progress });
    }
  }

  handlePlayheadPan = x => {
    // console.log(Dimensions.get("#PlaybackTimeline"));

    var progress = x > 0 ? x / this.state.layout.width : 0;
    progress = Math.max(progress, 0)
    progress = Math.min(progress, 1)

    this.setState({progress});
    this.props.onScrub(progress);
  };

  handlePlayheadPanStart = () => {
    this.setState({
      ignorePropsProgress: true
    });
  };

  handlePlayheadPanEnd = () => {
    this.setState({
      ignorePropsProgress: false
    });
  };

  handleContainerLayout = e => {
    this.setState({
      containerLayout: { ...e.nativeEvent.layout }
    });
  };

  handleLayout = e => {
    this.setState({
      layout: { ...e.nativeEvent.layout }
    });
  };

  formattedTime = time => {
    if (time === undefined || time === 0 || this.props.duration === 0) return "00:00"
    var minutes = Math.floor(time / 60);
    if (minutes < 10) minutes = "0" + minutes;

    var seconds = Math.floor(time - minutes * 60);
    if (seconds < 10) seconds = "0" + seconds;

    return minutes + ":" + seconds;
  }
}

PlaybackTimeline.propTypes = {
  onScrub: PropTypes.func
};

export default PlaybackTimeline;
