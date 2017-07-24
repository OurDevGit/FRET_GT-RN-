import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { View } from "react-native";

import * as actions from "../../redux/actions";
import { playerBackground } from "../../design";

import Song from "./Song";
import Video from "./Video";

class MediaPlayer extends Component {
  state = {
    isVideo: false
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: playerBackground,
          margin: 4,
          padding: 2,
          borderRadius: 6
        }}
      >
        {this.props.song !== undefined && this.props.song !== null
          ? <Song
              song={this.props.song}
              updateMidiData={this.props.updateMidiData}
              clearMidiData={this.props.clearMidiData}
              markers={this.props.markers}
              updateTime={this.props.updateTime}
            />
          : <View />}
        {this.props.video !== undefined && this.props.video !== null
          ? <Video video={this.props.video} />
          : <View />}
      </View>
    );
  }
}

MediaPlayer.propTypes = {
  song: PropTypes.object,
  video: PropTypes.object,
  updateMidiData: PropTypes.func.isRequired,
  clearMidiData: PropTypes.func.isRequired,
  updateTime: PropTypes.func.isRequired,
  markers: PropTypes.object
};

const mapStateToProps = state => {
  return {
    markers: state.get("markers")
  };
};

export default connect(mapStateToProps, actions)(MediaPlayer);
