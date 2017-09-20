import React from "react";
import PropTypes from "prop-types";
import { View, Text, TouchableOpacity } from "react-native";
import { PrimaryBlue } from "../../design";

class Marker extends React.Component {
  state = {
    width: 0
  };

  render() {
    const { marker, left, end, onMarkerPress, onMarkerLongPress } = this.props;
    const adjustedLeft = left - (this.state.width - 30) / 2;

    return (
      <TouchableOpacity
        key={marker.name}
        style={{
          position: "absolute",
          top: 0,
          left: adjustedLeft,
          height: "100%",
          alignItems: "center"
        }}
        onLayout={this.handleLayout}
        onPress={() => {
          onMarkerPress(marker.time);
        }}
        onLongPress={() => {
          onMarkerLongPress(marker.time, end);
        }}
      >
        {this.state.width > 0 && (
          <View
            style={{ width: 2, height: 15, backgroundColor: PrimaryBlue }}
          />
        )}

        <View
          style={{
            flexDirection: "row",
            transform: [{ rotate: "-45deg" }]
          }}
        >
          <Text
            style={{
              fontSize: 17,
              color: `rgba(0, 0, 0, ${this.state.width === 0 ? 0.0 : 1.0})`
            }}
          >
            {marker.name}
          </Text>
          <Text
            style={{
              fontSize: 17,
              color: "rgba(0, 0, 0, 0.0)"
            }}
          >
            {marker.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  handleLayout = e => {
    this.setState({
      width: e.nativeEvent.layout.width
    });
  };
}

Marker.propTypes = {
  marker: PropTypes.object.isRequired,
  left: PropTypes.number.isRequired,
  end: PropTypes.number.isRequired,
  onMarkerPress: PropTypes.func.isRequired,
  onMarkerLongPress: PropTypes.func.isRequired
};

export default Marker;
