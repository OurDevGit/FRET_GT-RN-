import React from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, TouchableOpacity, Button } from "react-native";

import RatePicker from "./RatePicker";
import ChapterPicker from "./ChapterPicker";
import PlaybackTimeline from "./PlaybackTimeline";

const styles = StyleSheet.create({
  controls: {
    flex: 1,
    backgroundColor: "transparent",
    position: "absolute",
    width: "100%",
    height: "100%"
    // justifyContent: "center",
    // alignItems: "center"
  }
});

class VideoOverlay extends React.Component {
  state = {};

  render() {
    // console.log(this.props.markers);
    return (
      <View style={styles.controls}>
        <View
          style={{
            backgroundColor: "rgba(200,200,200,1)",
            height: 40,
            alignItems: "center",
            flexDirection: "row"
          }}
        >
          <TouchableOpacity style={{ left: 10 }}>
            <Text>Done</Text>
          </TouchableOpacity>
          <Text style={{ flex: 1, textAlign: "center" }}>
            {this.props.title}
          </Text>
          <TouchableOpacity>
            <Text>Heart</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => console.debug("touch middle")}
          style={{ flex: 1 }}
        />
        <View
          style={{
            bottom: 0,
            backgroundColor: "rgba(200,200,200,1)",
            flexDirection: "column"
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <View style={{ width: 80 }}>
              <ChapterPicker
                chapters={this.props.chapters}
                currentChapter={this.props.currentChapter}
                onChange={(chapter, index) => {
                  this.props.onSeek(chapter.begin);
                }}
              />
            </View>
            <View style={{ flex: 1 }} />
            <Text>Guitar </Text>
            <TouchableOpacity>
              <Text>VFB Icon</Text>
            </TouchableOpacity>
          </View>
          <View />
          <View style={{ height: 20 }}>
            <PlaybackTimeline
              progress={this.props.progress}
              duration={this.props.duration}
              markers={this.props.markers}
              onScrub={this.handleScrub}
              onMarkerPress={this.handleMarkerPress}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              height: 40
            }}
          >
            <View style={{ width: 80 }}>
              <RatePicker
                rate={this.props.rate}
                onRateChange={this.props.onRateChange}
              />
            </View>
            <Button title="Loop" onPress={() => console.log("")} />
            <Button title="Start" onPress={() => console.log("")} />
            <Button title="End" onPress={() => console.log("")} />
            <Button title="Loop" onPress={() => console.log("")} />
            <Button title="My Loops" onPress={() => console.log("")} />
            <Button title="Info" onPress={() => console.log("")} />
            <Button title="BT Stat" onPress={() => console.log("")} />
          </View>
        </View>
      </View>
    );
  }
}

VideoOverlay.propTypes = {
  title: PropTypes.string.isRequired,
  chapters: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  onRateChange: PropTypes.func.isRequired,
  onSeek: PropTypes.func.isRequired,
  rate: PropTypes.number.isRequired,
  duration: PropTypes.number,
  progress: PropTypes.number
};

export default VideoOverlay;
