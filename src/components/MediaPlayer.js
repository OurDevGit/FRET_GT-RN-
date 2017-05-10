import React, { Component } from "react";
import { View, Button, Text, Picker } from "react-native";
import Video from "react-native-video";
import PlaybackTimeline from "./PlaybackTimeline";

class MediaPlayer extends Component {
  state = {
    isVideo: false,
    videoDuration: 0,
    playbackProgress: 0.0,
    playbackRate: 0.25
  };

  render() {
    return (
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around"
          }}
        >
          <Button title="Video" onPress={() => {}} />
          <Button title="Music" onPress={() => {}} />
        </View>
        <View style={{ alignItems: "center" }}>
          <Video
            ref={ref => {
              this.videoPlayer = ref;
            }}
            source={require("../../test-small.mp4")}
            style={{
              width: 200,
              height: 112.5
            }}
            //progressUpdateInterval={2000}
            onLoad={this.handleVideoLoad}
            onProgress={this.handleVideoProgress}
            rate={0.5}
          />
          <PlaybackTimeline
            progress={this.state.playbackProgress}
            onScrub={this.handleScrub}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around"
            }}
          >
            <View style={{ width: 100, height: 50 }}>
              <Picker
                selectedValue={this.state.playbackRate}
                onValueChange={this.handleRateChange}
                mode="dropdown"
              >
                <Picker.Item label="1x" value={1} />
                <Picker.Item label="0.25x" value={0.25} />
                <Picker.Item label="0.5x" value={0.5} />
              </Picker>
            </View>

            <Button title="-10" onPress={this.handleBackPress} />
            <Button title="Toggle" onPress={this.handleForwardPress} />
            <Button title="+10" onPress={this.handleTogglePress} />
          </View>
        </View>
      </View>
    );
  }

  handleBackPress = () => {};

  handleForwardPress = () => {};

  handleTogglePress = () => {};

  handleVideoProgress = progress => {
    const proportion = progress.currentTime / this.state.videoDuration;
    this.setState({
      playbackProgress: proportion
    });
  };

  handleVideoLoad = videoDetails => {
    this.setState({
      videoDuration: videoDetails.duration
    });
  };

  handleScrub = progress => {
    this.videoPlayer.seek(progress * this.state.videoDuration);
  };

  handleRateChange = rate => {
    console.log(`new rate: ${rate}`);
    this.setState({
      playbackRate: rate
    });
  };
}

export default MediaPlayer;
