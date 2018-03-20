import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, StyleSheet } from "react-native";

import { PrimaryBlue } from "../../../design";

import Playline from "./Playline";
import PlaybackMarkers from "./Markers";
import LoopFlag from "./LoopFlag.js";
import {
  subscribeToTimeUpdates,
  unsubscribeToTimeUpdates
} from "../../../time-store";

class Timeline extends Component {
  state = {
    layout: { width: 1, x: 0 },
    containerLayout: { width: 1 },
    progress: this.props.progress,
    ignorePropsProgress: false
  };

  render() {
    const {
      duration,
      markers,
      currentLoop,
      loopIsEnabled,
      onMarkerPress,
      onMarkerLongPress
    } = this.props;
    const { progress, layout, containerLayout } = this.state;

    const loop = currentLoop.toJS() || { begin: -1, end: -1 };
    const beginLeft = loop.begin / duration;
    const endLeft = loop.end / duration;

    return (
      <View style={styles.container} onLayout={this.handleContainerLayout}>
        <View style={{ flex: 1, height: 18 }} onLayout={this.handleLayout}>
          <View style={styles.timeline} />
        </View>

        {loop.begin > -1 && (
          <LoopFlag
            type="begin"
            isEnabled={loopIsEnabled}
            left={layout.x + beginLeft * layout.width}
          />
        )}

        {loop.end > -1 && (
          <LoopFlag
            type="end"
            isEnabled={loopIsEnabled}
            left={layout.x + endLeft * layout.width}
          />
        )}

        <Playline
          scrollLeft={progress * layout.width}
          onPan={this.handlePlayheadPan}
          onPanStart={this.handlePlayheadPanStart}
          onPanEnd={this.handlePlayheadPanEnd}
        />

        <PlaybackMarkers
          left={layout.x}
          width={containerLayout.width}
          height={containerLayout.height - layout.height}
          duration={duration}
          markers={markers}
          onMarkerPress={onMarkerPress}
          onMarkerLongPress={onMarkerLongPress}
        />
      </View>
    );
  }

  componentDidMount() {
    subscribeToTimeUpdates(this.handleTime);
  }

  componentWillUnmount() {
    unsubscribeToTimeUpdates(this.handleTime);
  }

  componentWillReceiveProps(newProps) {
    if (
      newProps.progress != this.state.progress &&
      this.state.ignorePropsProgress === false
    ) {
      this.setState({ progress: newProps.progress });
    }
  }

  handleTime = time => {
    this.setState({ progress: time / this.props.duration });
  };

  handlePlayheadPan = x => {
    var progress = x > 0 ? x / this.state.layout.width : 0;
    progress = Math.max(progress, 0);
    progress = Math.min(progress, 1);

    this.setState({ progress });
    this.props.onSeek(progress);
  };

  handlePlayheadPanStart = () => {
    this.setState({
      ignorePropsProgress: true
    });

    if (this.props.onSeekStart !== undefined) {
      this.props.onSeekStart();
    }
  };

  handlePlayheadPanEnd = () => {
    this.setState({
      ignorePropsProgress: false
    });
    this.props.onSeekEnd();
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

Timeline.propTypes = {
  duration: PropTypes.number.isRequired,
  progress: PropTypes.number.isRequired,
  markers: PropTypes.object.isRequired,
  currentLoop: PropTypes.object.isRequired,
  loopIsEnabled: PropTypes.bool.isRequired,
  onSeekStart: PropTypes.func,
  onSeek: PropTypes.func,
  onSeekEnd: PropTypes.func,
  onMarkerPress: PropTypes.func.isRequired,
  onMarkerLongPress: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end"
  },
  timeline: {
    position: "absolute",
    height: 2,
    width: "100%",
    backgroundColor: PrimaryBlue,
    bottom: 0
  }
});

export default Timeline;
