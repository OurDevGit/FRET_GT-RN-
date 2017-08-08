import React, { Component } from "react";
import { View, Button, Text, TouchableOpacity } from "react-native";
import { PrimaryBlue } from "../../design";
import MarkerFull from "./MarkerFull";
import MarkerAbbreviated from "./MarkerAbbreviated";

class PlaybackMarkers extends React.Component {
  render() {
    const {
      left,
      width,
      height,
      duration,
      markers,
      onMarkerPress,
      onMarkerLongPress
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
        {this.buttonsForMarkers(
          left,
          width,
          height,
          duration,
          markers,
          onMarkerPress,
          onMarkerLongPress
        )}
      </View>
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!nextProps.markers) return false;

    return (
      !nextProps.markers.equals(this.props.markers) ||
      nextProps.duration !== this.props.duration ||
      nextProps.width !== this.props.width ||
      nextProps.height !== this.props.height
    );
  }

  buttonsForMarkers(
    left,
    width,
    height,
    duration,
    markers,
    onMarkerPress,
    onMarkerLongPress
  ) {
    if (markers && duration > 0 && markers.count() > 0 && width > 0) {
      var buttons = [];
      var operationalWidth = width - left * 2;

      var buttons = markers.map((marker, index) => {
        var percent = marker.time / duration;
        var x = left - 15 + operationalWidth * percent;
        var end =
          index < markers.count() - 1 ? markers.get(index + 1).time : duration;
        console.log("height", height);

        if (height > 200) {
          return (
            <MarkerAbbreviated
              key={marker.name}
              marker={marker}
              left={x}
              onMarkerPress={onMarkerPress}
              onMarkerLongPress={onMarkerLongPress}
            />
          );
        } else if (height > 40) {
          return (
            <MarkerAbbreviated
              key={marker.name}
              marker={marker}
              left={x}
              onMarkerPress={onMarkerPress}
              onMarkerLongPress={onMarkerLongPress}
            />
          );
        } else if (height > 200) {
          return (
            <MarkerAbbreviated
              key={marker.name}
              marker={marker}
              left={x}
              onMarkerPress={onMarkerPress}
              onMarkerLongPress={onMarkerLongPress}
            />
          );
        }
      });

      return buttons;
    } else {
      return <View />;
    }
  }
}

export default PlaybackMarkers;
