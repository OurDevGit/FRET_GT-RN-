import React, { Component } from "react";
import PropTypes from "prop-types";
import { View } from "react-native";

import { PrimaryBlue } from "../../../design";

import Playline from "./Playline";
import PlaybackMarkers from "./Markers";
import LoopFlag from "./LoopFlag.js";

class PlaybackTimeline extends Component {
  state = {
    layout: { width: 1 },
    containerLayout: { width: 1 },
    progress: this.props.progress,
    ignorePropsProgress: false
  };

  render() {
    const {
      duration,
      markers,
      currentLoop,
      onMarkerPress,
      onMarkerLongPress
    } = this.props;
    const { progress, layout, containerLayout } = this.state;

    const begin = (currentLoop.get("begin") || -1) / duration;
    const end = (currentLoop.get("end") || -1) / duration;

    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "flex-start",
          marginHorizontal: 10,
          marginTop: 8,
          marginBottom: -10
        }}
        onLayout={this.handleContainerLayout}
      >
        <PlaybackMarkers
          left={layout.x}
          width={containerLayout.width}
          height={containerLayout.height - layout.height}
          duration={duration}
          markers={markers}
          onMarkerPress={onMarkerPress}
          onMarkerLongPress={onMarkerLongPress}
        />

        <View style={{ flex: 1, height: 18 }} onLayout={this.handleLayout}>
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

        {begin > 0 &&
          <LoopFlag type="begin" left={layout.x + begin * layout.width} />}

        {end > 0 &&
          <LoopFlag type="end" left={layout.x + end * layout.width} />}

        <Playline
          onPan={this.handlePlayheadPan}
          onPanStart={this.handlePlayheadPanStart}
          onPanEnd={this.handlePlayheadPanEnd}
          scrollLeft={progress * layout.width}
          containerLeft={layout.x !== undefined ? layout.x - 9 : -1000}
        />
      </View>
    );
  }

  componentWillReceiveProps(newProps) {
    if (
      newProps.progress != this.state.progress &&
      this.state.ignorePropsProgress === false
    ) {
      this.setState({ progress: newProps.progress });
    }
  }

  handlePlayheadPan = x => {
    var progress = x > 0 ? x / this.state.layout.width : 0;
    progress = Math.max(progress, 0);
    progress = Math.min(progress, 1);

    this.setState({ progress });
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
}

PlaybackTimeline.propTypes = {
  onScrub: PropTypes.func
};

export default PlaybackTimeline;
