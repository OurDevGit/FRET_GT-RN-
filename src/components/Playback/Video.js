import React from "react";
import { View, StyleSheet, TouchableOpacity, Button } from "react-native";
import PropTypes from "prop-types";

import RNFetchBlob from "react-native-fetch-blob";

import Video from "react-native-video";

// import PlaybackPrimary from "./PlaybackPrimary";
// import PlaybackTimeline from "./PlaybackTimeline";
// import PlaybackSecondary from "./PlaybackSecondary";
// import Midi from "./Midi";

// import { loadMidi, clearMidi } from "../../selectors";

const styles = StyleSheet.create({
  backgroundVideo: {
    height: "100%"
  },
  fullScreen: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  },
  controls: {
    flex: 1,
    backgroundColor: "transparent",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center"
  }
});

class Vid extends React.Component {
  state = {
    isPlaying: false,
    mediaDuration: 0,
    playbackProgress: 0.0,
    playbackSeconds: 0.0,
    playbackRate: 1,
    seek: -1,
    videoUri: null,
    paused: false
  };

  render() {
    // const mediaTitle =
    //   this.props.video !== undefined ? this.props.video.name : "";

    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <TouchableOpacity
          style={styles.fullScreen}
          onPress={() => this.setState({ paused: !this.state.paused })}
        >
          <Video
            style={styles.backgroundVideo}
            source={require("../../lesson.mp4")}
            paused={this.state.paused}
            resizeMode="stretch"
          />
        </TouchableOpacity>
        <View style={styles.controls}>
          <Button title="Button 1" />
        </View>
      </View>
    );
  }

  componentWillMount() {
    const path = RNFetchBlob.fs.asset("config.json");
    RNFetchBlob.fs
      .readFile(path, "utf8")
      .then(json => {
        const j = JSON.parse(json);
        console.debug(j);
      })
      .catch(err => {
        console.error(err);
      });

    this.setState({
      videoUri: RNFetchBlob.fs.asset("lesson.mp4")
    });
  }

  componentWillReceiveProps(newProps) {
    console.log(newProps);
  }
}

Vid.propTypes = {
  video: PropTypes.object
};

export default Vid;
