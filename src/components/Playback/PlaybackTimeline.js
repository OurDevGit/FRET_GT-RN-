import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet } from "react-native";

import { PrimaryBlue } from "../../design";
import Playhead from "./Playhead";
import PlaybackMarkers from "./PlaybackMarkers";
import LoopFlag from "./PlaybackTimelineLoopFlag.js";
import {
  subscribeToTimeUpdates,
  unsubscribeToTimeUpdates
} from "../../time-store";

class PlaybackTimeline extends Component {
  constructor(props) {
    super(props);

    this.state = {
      layout: { width: 1, x: 0 },
      containerLayout: { width: 1 },
      progress: props.progress,
      ignorePropsProgress: false
    };
  }

  render() {
    const {
      duration,
      markers,
      currentLoop,
      currentVideoMarker,
      currentVideoChapter,
      loopIsEnabled,
      isVideo,
      isFullscreen,
      onMarkerPress,
      onMarkerLongPress
    } = this.props;
    const { progress, layout, containerLayout } = this.state;

    const offsetProgress = this.getOffsetProgress(
      progress,
      duration,
      currentVideoChapter,
      currentVideoMarker
    );
    const offsetDuration = this.getOffsetDuration(
      duration,
      currentVideoChapter,
      currentVideoMarker
    );

    const elapsed = this.formattedTime(
      this.getOffsetElapsed(progress, duration, currentVideoMarker)
    );
    const remaining = this.formattedTime(
      this.getOffsetRemaining(progress, duration, currentVideoMarker)
    );

    const loop = currentLoop.toJS() || { begin: -1, end: -1 };
    const beginLeft = this.offsetTime(loop.begin) / offsetDuration;
    const endLeft = this.offsetTime(loop.end) / offsetDuration;

    return (
      <View
        style={[
          styles.container,
          {
            flex: isVideo ? -1 : 2,
            marginHorizontal: isVideo && !isFullscreen ? "10%" : 5,
            marginBottom: isVideo ? 20 : -10
          }
        ]}
        onLayout={this.handleContainerLayout}
      >
        {!isVideo && (
          <PlaybackMarkers
            left={layout.x}
            width={containerLayout.width}
            height={containerLayout.height - layout.height}
            duration={offsetDuration}
            markers={markers}
            onMarkerPress={onMarkerPress}
            onMarkerLongPress={onMarkerLongPress}
          />
        )}

        <Text style={styles.time}>{elapsed}</Text>
        <View
          style={{ flex: 1, top: 15, height: 18 }}
          onLayout={this.handleLayout}
        >
          <View
            style={[
              styles.timeline,
              {
                backgroundColor: isFullscreen ? "black" : PrimaryBlue
              }
            ]}
          />
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
        {this.state.layout.width > 1 && (
          <Playhead
            onPan={this.handlePlayheadPan}
            onPanStart={this.handlePlayheadPanStart}
            onPanEnd={this.handlePlayheadPanEnd}
            scrollLeft={offsetProgress * layout.width}
            containerLeft={layout.x !== undefined ? layout.x - 9 : -1000}
          />
        )}

        <Text style={[styles.time, styles.remaining]}>{"-" + remaining}</Text>
      </View>
    );
  }

  componentDidMount() {
    subscribeToTimeUpdates(this.handleTimeUpdate);
  }

  componentWillUnmount() {
    unsubscribeToTimeUpdates(this.handleTimeUpdate);
  }

  handleTimeUpdate = time => {
    if (this.state.ignorePropsProgress === false && time > -1) {
      if (this.props.duration === 0) {
        this.setState({
          progress: 0
        });
      } else {
        this.setState({ progress: time / this.props.duration });
      }
    }
  };

  handlePlayheadPan = x => {
    const {
      duration,
      currentLoop,
      currentVideoChapter,
      currentVideoMarker,
      loopIsEnabled,
      onLoopEnable,
      onSeek
    } = this.props;

    var progress = x > 0 ? x / this.state.layout.width : 0;
    progress = Math.max(progress, 0);
    progress = Math.min(progress, 1);

    var adjustedProgress = progress;
    var time = progress * duration;

    if (
      currentVideoMarker !== undefined &&
      currentVideoMarker.begin !== undefined
    ) {
      const { begin, end } = currentVideoMarker;
      const markerDuration = end - begin;
      adjustedProgress = (begin + progress * markerDuration) / duration;
      time = begin + progress * markerDuration;
    } else if (
      currentVideoChapter !== undefined &&
      currentVideoChapter.begin !== undefined
    ) {
      const { begin, end } = currentVideoChapter;
      const chapterDuration = end - begin;
      adjustedProgress = (begin + progress * chapterDuration) / duration;
      time = begin + progress * chapterDuration;
    }

    const begin = currentLoop.get("begin") || 0;
    const end = currentLoop.get("end") || duration;

    if ((time < begin || time > end) && loopIsEnabled) {
      onLoopEnable(false);
    }

    this.setState({ progress: adjustedProgress });
    onSeek(adjustedProgress);
  };

  handlePlayheadPanStart = () => {
    if (this.props.onForceControlsVisible !== undefined) {
      this.props.onForceControlsVisible(true);
    }

    this.setState({
      ignorePropsProgress: true
    });

    if (this.props.onSeekStart !== undefined) {
      this.props.onSeekStart();
    }
  };

  handlePlayheadPanEnd = () => {
    if (this.props.onForceControlsVisible !== undefined) {
      this.props.onForceControlsVisible(false);
    }
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

  offsetTime = time => {
    const { currentVideoMarker, currentVideoChapter } = this.props;
    if (
      currentVideoMarker !== undefined &&
      currentVideoMarker.begin !== undefined
    ) {
      return time - currentVideoMarker.begin;
    } else if (
      currentVideoChapter !== undefined &&
      currentVideoChapter.begin !== undefined
    ) {
      return time - currentVideoChapter.begin;
    } else {
      return time;
    }
  };

  getOffsetProgress = (progress, duration, chapter, marker) => {
    if (marker !== undefined && marker.begin !== undefined) {
      const time = progress * duration;
      const adjusted = time - marker.begin;
      const offset = adjusted / (marker.end - marker.begin);
      return isNaN(offset) ? 0 : offset;
    } else if (chapter !== undefined && chapter.begin !== undefined) {
      const time = progress * duration;
      const adjusted = time - chapter.begin;
      const offset = adjusted / (chapter.end - chapter.begin);
      return isNaN(offset) ? 0 : offset;
    } else {
      return isNaN(progress) ? 0 : progress;
    }
  };

  getOffsetDuration = (duration, chapter, marker) => {
    if (marker !== undefined && marker.begin !== undefined) {
      return marker.end - marker.begin;
    } else if (chapter !== undefined && chapter.begin !== undefined) {
      return chapter.end - chapter.begin;
    } else {
      return duration;
    }
  };

  getOffsetElapsed = (progress, duration, marker) => {
    if (marker !== undefined && marker.begin !== undefined) {
      const time = progress * duration;
      const adjusted = time - marker.begin;
      const offset = adjusted / (marker.end - marker.begin);
      return isNaN(offset) ? 0 : offset;
    } else {
      return isNaN(progress) ? 0 : progress * duration;
    }
  };

  getOffsetRemaining = (progress, duration, marker) => {
    var val;
    if (marker !== undefined && marker.begin !== undefined) {
      val = marker.end - marker.begin;
    } else {
      val = duration;
    }

    return val - this.getOffsetElapsed(progress, duration, marker);
  };

  formattedTime = time => {
    if (time === undefined || time === 0 || this.props.duration === 0)
      return "00:00";
    var minutes = Math.floor(time / 60);
    if (minutes < 10) minutes = "0" + minutes;
    if (minutes.length === 1) minutes = `${minutes}0`;

    var seconds = Math.floor(time - minutes * 60);
    seconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    if (seconds.length === 1) seconds = `${seconds}0`;

    return minutes + ":" + seconds;
  };
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    marginTop: 8
  },
  time: {
    width: 62,
    height: 20,
    marginTop: 15,
    marginLeft: -6,
    marginRight: 0,
    textAlign: "center"
  },
  remaining: {
    marginLeft: 0,
    marginRight: -6
  },
  timeline: {
    position: "absolute",
    height: 1,
    width: "100%",
    top: 10
  }
});

PlaybackTimeline.propTypes = {
  duration: PropTypes.number,
  progress: PropTypes.number,
  markers: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  videoMarkers: PropTypes.array,
  currentViewoChapter: PropTypes.object,
  currentLoop: PropTypes.object,
  currentVideoMarker: PropTypes.object,
  currentVideoChapter: PropTypes.object,
  loopIsEnabled: PropTypes.bool,
  isVideo: PropTypes.bool,
  isFullscreen: PropTypes.bool,
  onSeekStart: PropTypes.func,
  onSeek: PropTypes.func,
  onSeekEnd: PropTypes.func,
  onLoopEnable: PropTypes.func,
  onMarkerPress: PropTypes.func,
  onMarkerLongPress: PropTypes.func,
  onForceControlsVisible: PropTypes.func
};

export default PlaybackTimeline;
