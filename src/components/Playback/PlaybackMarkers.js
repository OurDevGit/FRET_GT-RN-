import React, { Component } from "react";
import { View, Button, Text, TouchableOpacity } from "react-native";
import { PrimaryBlue } from "../../design";

class PlaybackMarkers extends React.Component {
  render() {
    const {
      left,
      width,
      height,
      duration,
      markers,
      onMarkerPress
    } = this.props;
    return (
      <View
        style={{
          position: "absolute",
          top: 10,
          left: 0,
          width: width,
          height: height + 10
        }}
      >
        {this.buttonsForMarkers(left, width, duration, markers, onMarkerPress)}
      </View>
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!nextProps.markers) return false;

    return (
      !nextProps.markers.equals(this.props.markers) ||
      nextProps.duration !== this.props.duration
    );
  }

  buttonsForMarkers(left, width, duration, markers, onMarkerPress) {
    if (markers && duration > 0 && markers.count() > 0) {
      var buttons = [];
      var operationalWidth = width - left * 2;

      var buttons = markers.map((marker, index) => {
        var percent = marker.time / duration;
        var x = left - 15 + operationalWidth * percent;

        return (
          <TouchableOpacity
            key={marker.name}
            style={{
              position: "absolute",
              top: 0,
              left: x,
              width: 30,
              alignItems: "center"
            }}
            onPress={() => {
              onMarkerPress(marker.time);
            }}
          >
            <View
              style={{ width: 2, height: 10, backgroundColor: PrimaryBlue }}
            />
            <Text style={{ fontSize: 12 }}>
              {marker.abbreviation}
            </Text>
          </TouchableOpacity>
        );
      });

      return buttons;
    } else {
      return <View />;
    }
  }
}

export default PlaybackMarkers;
