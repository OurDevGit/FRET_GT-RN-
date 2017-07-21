import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { View, Button, Text, StyleSheet } from "react-native";
import Video from "react-native-video";

import * as actions from "../../redux/actions";
import { playerBackground } from "../../design";

import Song from "./Song";

const styles = StyleSheet.create({
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: 320,
    height: 240
  }
});

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
        <Song
          song={this.props.song}
          updateMidiData={this.props.updateMidiData}
          clearMidiData={this.props.clearMidiData}
          markers={this.props.markers}
          updateTime={this.props.updateTime}
        />
      </View>
    );
  }
}

MediaPlayer.propTypes = {
  song: PropTypes.object,
  updateMidiData: PropTypes.func.isRequired,
  clearMidiData: PropTypes.func.isRequired,
  updateTime: PropTypes.func.isRequired
};

const mapStateToProps = (state, props) => {
  return {
    markers: state.get("markers")
  };
};

export default connect(mapStateToProps, actions)(MediaPlayer);
