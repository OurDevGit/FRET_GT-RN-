import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { View } from "react-native";

import * as actions from "../../redux/actions";

import Song from "./Song";
import Video from "./Video";

class MediaPlayer extends Component {
  state = {
    isVideo: false,
    layout: { width: 1, height: 1 }
  };

  render() {
    // console.log({ song: this.props.song });
    // console.log({ vid: this.props.video });

    return (
      <View style={{ flex: 1 }} onLayout={this.handleLayout}>
        {this.props.song !== undefined &&
          this.props.song !== null &&
          <Song
            song={this.props.song}
            trackCount={this.props.trackCount}
            height={this.state.layout.height}
            updateMidiData={this.props.updateMidiData}
            clearMidiData={this.props.clearMidiData}
            markers={this.props.markers}
            updateTime={this.props.updateTime}
            currentLoop={this.props.currentLoop}
            visibleTracks={this.props.visibleTracks}
            loopIsEnabled={this.props.loopIsEnabled}
            connectedDevices={0}
            enableLoop={this.props.enableLoop}
            setCurrentLoop={this.props.setCurrentLoop}
            clearCurrentLoop={this.props.clearCurrentLoop}
            onToggleLibrary={this.props.onToggleLibrary}
          />}
        {this.props.video !== undefined &&
          this.props.video !== null &&
          <Video
            video={this.props.video}
            height={this.state.layout.height}
            markers={this.props.makers}
            updateMidiData={this.props.updateMidiData}
            clearMidiData={this.props.clearMidiData}
            updateTime={this.props.updateTime}
            currentLoop={this.props.currentLoop}
            visibleTracks={this.props.visibleTracks}
            loopIsEnabled={this.props.loopIsEnabled}
            connectedDevices={0}
            enableLoop={this.props.enableLoop}
            setCurrentLoop={this.props.setCurrentLoop}
            clearCurrentLoop={this.props.clearCurrentLoop}
          />}
      </View>
    );
  }

  handleLayout = e => {
    this.setState({
      layout: {
        width: e.nativeEvent.layout.width,
        height: e.nativeEvent.layout.height
      }
    });
  };
}

MediaPlayer.propTypes = {
  song: PropTypes.object,
  video: PropTypes.object,
  updateMidiData: PropTypes.func.isRequired,
  clearMidiData: PropTypes.func.isRequired,
  updateTime: PropTypes.func.isRequired,
  markers: PropTypes.object,
  currentLoop: PropTypes.object,
  loopIsEnabled: PropTypes.bool,
  enableLoop: PropTypes.func.isRequired,
  setCurrentLoop: PropTypes.func.isRequired,
  clearCurrentLoop: PropTypes.func.isRequired
};

const mapStateToProps = (state, props) => {
  return {
    markers: state.get("markers"),
    currentLoop: state.get("currentLoop"),
    loopIsEnabled: state.get("loopIsEnabled"),
    visibleTracks: state.get("visibleTracks")
  };
};

export default connect(mapStateToProps, actions)(MediaPlayer);
