import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { View } from "react-native";

import * as actions from "../../redux/actions";
import { List, Map } from "immutable";

import Song from "./Song";
import Video from "./Video";
import { setTime } from "../../time-store";
import { setMidiOffset, clearMidiOffset } from "../../midi-store";

class MediaPlayer extends Component {
  state = {
    isVideo: false,
    layout: { width: 1, height: 1 }
  };

  render() {
    // console.log({ song: this.props.song });
    // console.log({ vid: this.props.video });
    const trackCount =
      this.props.visibleTracks !== undefined
        ? this.props.visibleTracks.count()
        : 0;
    return (
      <View style={{ flex: 1 }} onLayout={this.handleLayout}>
        {this.props.song !== undefined &&
          this.props.song !== null && (
            <Song
              song={this.props.song}
              trackCount={trackCount}
              countdownTimerState={this.props.countdownTimerState}
              height={this.state.layout.height}
              updateMidiData={this.props.updateMidiData}
              clearMidiData={this.props.clearMidiData}
              updateTime={setTime}
              enableLoop={this.props.enableLoop}
              setCurrentLoop={this.props.setCurrentLoop}
              clearCurrentLoop={this.props.clearCurrentLoop}
              onSelectTempo={this.handleSelectTempo}
              onToggleLibrary={this.props.onToggleLibrary}
              onToggleFretlightAdmin={this.props.onToggleFretlightAdmin}
              onCountdownTimer={this.props.onCountdownTimer}
            />
          )}
        {this.props.video !== undefined &&
          this.props.video !== null && (
            <Video
              video={this.props.video}
              height={this.state.layout.height}
              countdownTimerState={this.props.countdownTimerState}
              updateMidiData={this.props.updateMidiData}
              clearMidiData={this.props.clearMidiData}
              updateTime={setTime}
              enableLoop={this.props.enableLoop}
              setCurrentLoop={this.props.setCurrentLoop}
              clearCurrentLoop={this.props.clearCurrentLoop}
              onSelectTempo={this.handleSelectTempo}
              setVideoChapters={this.props.setVideoChapters}
              setVideoMidiFiles={this.props.setVideoMidiFiles}
              setCurrentVideoChapter={this.props.setCurrentVideoChapter}
              setCurrentVideoMarker={this.props.setCurrentVideoMarker}
              setCurrentVideoMidiFile={this.handleSetCurrentVideoMidiFile}
              onToggleAd={this.props.onToggleAd}
              onToggleFretboards={this.props.onToggleFretboards}
              onClearMedia={this.props.onClearMedia}
              onToggleFretlightAdmin={this.props.onToggleFretlightAdmin}
              onCountdownTimer={this.props.onCountdownTimer}
            />
          )}
      </View>
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.song !== nextProps.song ||
      this.props.video !== nextProps.video ||
      this.props.countdownTimerState !== nextProps.countdownTimerState ||
      this.state.layout.width !== nextState.layout.width ||
      this.state.layout.height !== nextState.layout.height
    );
  }

  componentWillUpdate(nextProps, nextState) {
    if (
      this.props.song !== nextProps.song ||
      this.props.video !== nextProps.video
    ) {
      clearMidiOffset();
      this.props.clearVideoLesson();
    }
  }

  handleSelectTempo = tempo => {
    if (tempo === 0) {
      const first = this.props.visibleTracks.first();
      this.props.updateVisibleTracks(List([first]));
    }
  };

  handleLayout = e => {
    this.setState({
      layout: {
        width: e.nativeEvent.layout.width,
        height: e.nativeEvent.layout.height
      }
    });
  };

  handleSetCurrentVideoMidiFile = midi => {
    setMidiOffset(midi.get("begin"));
    this.props.setCurrentVideoMidiFile(midi);
  };
}

MediaPlayer.propTypes = {
  song: PropTypes.object,
  video: PropTypes.object,
  countdownTimerState: PropTypes.bool.isRequired,
  visibleTracks: PropTypes.object,
  videoChapters: PropTypes.object,
  videoMarkers: PropTypes.object,
  onToggleLibrary: PropTypes.func.isRequired,
  updateMidiData: PropTypes.func.isRequired,
  clearMidiData: PropTypes.func.isRequired,
  enableLoop: PropTypes.func.isRequired,
  setCurrentLoop: PropTypes.func.isRequired,
  clearCurrentLoop: PropTypes.func.isRequired,
  setVideoChapters: PropTypes.func.isRequired,
  setVideoMidiFiles: PropTypes.func.isRequired,
  setCurrentVideoChapter: PropTypes.func.isRequired,
  setCurrentVideoMarker: PropTypes.func.isRequired,
  setCurrentVideoMidiFile: PropTypes.func.isRequired,
  clearVideoLesson: PropTypes.func.isRequired,
  onToggleAd: PropTypes.func.isRequired,
  onToggleFretboards: PropTypes.func.isRequired,
  onToggleFretlightAdmin: PropTypes.func.isRequired,
  onClearMedia: PropTypes.func.isRequired,
  onCountdownTimer: PropTypes.func.isRequired
};

export default connect(null, actions)(MediaPlayer);
