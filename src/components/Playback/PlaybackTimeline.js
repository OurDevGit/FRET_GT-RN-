import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { View, Dimensions, Text } from "react-native";

import { PrimaryBlue } from "../../design";

import Playhead from "./Playhead";
import PlaybackMarkers from "./PlaybackMarkers";
import LoopFlag from "./PlaybackTimelineLoopFlag.js";

import { BtnDownload, BtnDownloading } from "../StyleKit";

class PlaybackTimeline extends Component {
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
      videoMarkers,
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

    const offsetProgress = this.offsetProgress(
      progress,
      duration,
      currentVideoChapter,
      currentVideoMarker
    );
    const offsetDuration = this.offsetDuration(
      duration,
      currentVideoChapter,
      currentVideoMarker
    );

    const elapsed = this.formattedTime(offsetDuration * offsetProgress);
    const remaining = this.formattedTime(
      offsetDuration - offsetDuration * offsetProgress
    );

    const loop = currentLoop.toJS() || { begin: -1, end: -1 };
    const beginLeft = this.offsetTime(loop.begin) / offsetDuration;
    const endLeft = this.offsetTime(loop.end) / offsetDuration;

    return (
      <View
        style={{
          flex: isVideo ? -1 : 2,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "flex-start",
          marginHorizontal: isVideo && !isFullscreen ? "10%" : 10,
          marginTop: 8,
          marginBottom: isVideo ? 20 : -10
        }}
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

        <BtnDownloading style={{ width: 50, height: 50 }} progress={progress} />
        <BtnDownload style={{ width: 50, height: 50 }} color={PrimaryBlue} />

        <Text
          style={{
            width: 40,
            height: 20,
            marginTop: 15,
            marginHorizontal: 15,
            textAlign: "center"
          }}
        >
          {elapsed}
        </Text>
        <View
          style={{ flex: 1, top: 15, height: 18 }}
          onLayout={this.handleLayout}
        >
          <View
            style={{
              position: "absolute",
              height: 1,
              width: "100%",
              backgroundColor: isFullscreen ? "black" : PrimaryBlue,
              top: 10
            }}
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

        <Text
          style={{
            width: 40,
            height: 20,
            marginTop: 15,
            marginHorizontal: 15,
            textAlign: "center"
          }}
        >
          {"-" + remaining}
        </Text>
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
  };

  handlePlayheadPanEnd = () => {
    if (this.props.onForceControlsVisible !== undefined) {
      this.props.onForceControlsVisible(false);
    }
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

  offsetProgress = (progress, duration, chapter, marker) => {
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

  offsetDuration = (duration, chapter, marker) => {
    if (marker !== undefined && marker.begin !== undefined) {
      return marker.end - marker.begin;
    } else if (chapter !== undefined && chapter.begin !== undefined) {
      return chapter.end - chapter.begin;
    } else {
      return duration;
    }
  };

  formattedTime = time => {
    if (time === undefined || time === 0 || this.props.duration === 0)
      return "00:00";
    var minutes = Math.floor(time / 60);
    if (minutes < 10) minutes = "0" + minutes;

    var seconds = Math.floor(time - minutes * 60);
    if (seconds < 10) seconds = "0" + seconds;

    return minutes + ":" + seconds;
  };
}

PlaybackTimeline.propTypes = {
  duration: PropTypes.number,
  progress: PropTypes.number,
  markers: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  videoMarkers: PropTypes.array,
  currentLoop: PropTypes.object,
  currentVideoMarker: PropTypes.object,
  loopIsEnabled: PropTypes.bool,
  isVideo: PropTypes.bool,
  isFullscreen: PropTypes.bool,
  onSeek: PropTypes.func,
  onLoopEnable: PropTypes.func,
  onMarkerPress: PropTypes.func,
  onMarkerLongPress: PropTypes.func,
  onForceControlsVisible: PropTypes.func
};

const mapStateToProps = (state, ownProps) => {
  return {
    progress: state.get("time") / ownProps.duration
  };
};

export default connect(mapStateToProps)(PlaybackTimeline);
