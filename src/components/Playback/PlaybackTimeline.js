import React, { Component } from "react";
import PropTypes from 'prop-types';
import { View, Dimensions, Text } from "react-native";
import { PrimaryBlue } from "../../design"
import Playhead from "./Playhead";

class PlaybackTimeline extends Component {
  state = {
    layout: { width: 1 },
    progress: this.props.progress,
    ignorePropsProgress: false
  };

  render() {
    const elapsed = this.formattedTime(this.props.duration * this.state.progress)
    const remaining = this.formattedTime(this.props.duration - (this.props.duration * this.state.progress))

    return (
      <View style={{ flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
        <Text style={{ width: 40, height: 20, marginHorizontal: 10, textAlign: "center" }}>{elapsed}</Text>
        <View
          style={{
            flex: 1,
            height: 20
          }}
          onLayout={this.handleLayout}
        >
          <View
            style={{
              position: "absolute",
              height: 1,
              width: "100%",
              backgroundColor: PrimaryBlue,
              top: "50%",
              marginTop: -0.5
            }}
          />
          <Playhead
            onPan={this.handlePlayheadPan}
            onPanStart={this.handlePlayheadPanStart}
            onPanEnd={this.handlePlayheadPanEnd}
            left={this.state.progress * this.state.layout.width}
          />
        
        </View>
        <Text style={{ width: 40, height: 20, marginHorizontal: 10, textAlign: "center" }}>-{remaining}</Text>
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

  formattedTime = time => {
    if (time === undefined) return "00:00"
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
