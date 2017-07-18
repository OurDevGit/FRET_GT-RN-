import React, { Component } from "react";
import PropTypes from 'prop-types';
import { View, Dimensions, Text } from "react-native";

import { PrimaryBlue } from "../../design"

import Playhead from "./Playhead";
import PlaybackCounter from "./PlaybackCounter";
import PlaybackMarkers from "./PlaybackMarkers";

class PlaybackTimeline extends Component {
  state = {
    layout: { width: 1 },
    progress: this.props.progress,
    ignorePropsProgress: false
  };

  render() {
    return (
      <View style={{ flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "flex-start", marginHorizontal: 10, marginTop: 8 }}>
        <PlaybackCounter type="elapsed" duration={this.props.duration} />
        <View
          style={{ flex: 1 }}
          onLayout={this.handleLayout}
        >
          <PlaybackMarkers 
            duration={this.props.duration}
            markers={this.props.markers.toJS()}
            onMarkerPress={this.props.onMarkerPress}
          />
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
          <Playhead
            duration={this.props.duration}
            onPan={this.handlePlayheadPan}
            onPanStart={this.handlePlayheadPanStart}
            onPanEnd={this.handlePlayheadPanEnd}
            width={this.state.layout.width}
          />
        </View>
        <PlaybackCounter type="remaining" duration={this.props.duration} />
      </View>
    );
  }

  componentWillReceiveProps(newProps) {
    if (
      newProps.progress != this.state.progress &&
      this.state.ignorePropsProgress === false
    ) {
      const openGap = (this.state.layout.width - 20) / this.state.layout.width;

      this.setState({
        progress: newProps.progress * openGap
      });
    }
  }

  handlePlayheadPan = x => {
    // console.log(Dimensions.get("#PlaybackTimeline"));

    var progress = x > 0 ? x / this.state.layout.width : 0;
    if (x > this.state.layout.width - 20) {
      progress = (this.state.layout.width - 20) / this.state.layout.width;
    }

    this.setState({
      progress
    });

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

  handleLayout = e => {
    this.setState({
      layout: { ...e.nativeEvent.layout }
    });
  };
}

PlaybackTimeline.propTypes = {
  onScrub: PropTypes.func
};

export default PlaybackTimeline;
