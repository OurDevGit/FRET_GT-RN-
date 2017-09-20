import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, TouchableOpacity } from "react-native";
import { PrimaryBlue } from "../../../design";

class PlaybackMarkers extends React.Component {
  render() {
    return (
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: this.props.width,
          height: 20
        }}
      >
        {this.buttonsForMarkers()}
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

  buttonsForMarkers() {
    const {
      left,
      width,
      height,
      duration,
      markers,
      onMarkerPress,
      onMarkerLongPress
    } = this.props;

    if (markers && duration > 0 && markers.count() > 0 && width > 0) {
      var buttons = [];
      var operationalWidth = width - left * 2;

      var buttons = markers.map((marker, index) => {
        var percent = marker.time / duration;
        var x = width * percent;

        var end =
          index < markers.count() - 1 ? markers.get(index + 1).time : duration;

        return (
          <TouchableOpacity
            key={marker.name}
            style={{
              position: "absolute",
              bottom: 0,
              left: x - 15,
              width: 30,
              height: 20,
              alignItems: "center"
            }}
            onPress={() => {
              onMarkerPress(marker.time);
            }}
            onLongPress={() => {
              onMarkerLongPress(marker.time, end);
            }}
          >
            <View
              style={{
                width: 2,
                height: 10,
                marginTop: 10,
                backgroundColor: PrimaryBlue
              }}
            />
          </TouchableOpacity>
        );
      });

      return buttons;
    } else {
      return <View />;
    }
  }
}

PlaybackMarkers.propTypes = {
  left: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
  markers: PropTypes.array.isRequired,
  onMarkerPress: PropTypes.func.isRequired,
  onMarkerLongPress: PropTypes.func.isRequired
};

export default PlaybackMarkers;
