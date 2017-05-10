import React, { Component, PropTypes } from "react";
import { View, Dimensions } from "react-native";
import Playhead from "./Playhead";

class PlaybackTimeline extends Component {
  state = {
    layout: { width: 1 },
    progress: this.props.progress,
    ignorePropsProgress: false
  };

  render() {
    return (
      <View
        style={{
          height: 20,
          width: "90%",
          marginBottom: 10
        }}
        onLayout={this.handleLayout}
      >
        <View
          style={{
            position: "absolute",
            height: 1,
            width: "100%",
            backgroundColor: "#fff",
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
