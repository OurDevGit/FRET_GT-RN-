import React from "react";
import PropTypes from "prop-types";
import { View, Text, TouchableOpacity } from "react-native";
import { PrimaryBlue } from "../../design";

const lengthForHeight = h => {
  const hypot = h * Math.cos(Math.PI / 4);
  return hypot;
};

class Marker extends React.Component {
  state = {
    width: 0
  };

  render() {
    const { marker, left, end, onMarkerPress, onMarkerLongPress } = this.props;
    const adjustedLeft = left - (this.state.width - 30) / 2;

    return (
      <View
        key={marker.name}
        style={{
          position: "absolute",
          top: 0,
          left: adjustedLeft,
          height: "100%",
          alignItems: "center"
          // backgroundColor: "yellow"
        }}
        onLayout={this.handleLayout}
      >
        {this.state.width > 0 && (
          <View
            style={{ width: 2, height: 15, backgroundColor: PrimaryBlue }}
          />
        )}

        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            width: lengthForHeight(this.props.height),
            // backgroundColor: "blue",
            transform: [
              { rotate: "-45deg" },
              { translateX: lengthForHeight(this.props.height) / -2 },
              { translateY: this.props.height < 125 ? -5 : 0 }
            ]
          }}
        >
          <TouchableOpacity
            // style={{ backgroundColor: "red" }}
            onPress={() => {
              onMarkerPress(marker.time, marker.name);
            }}
            onLongPress={() => {
              onMarkerLongPress(marker.time, end, marker.name);
            }}
          >
            <Text
              style={{
                fontSize: 17,
                color: `rgba(0, 0, 0, ${this.state.width === 0 ? 0.0 : 1.0})`,
                width: lengthForHeight(this.props.height),
                textAlign: "right"
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {marker.name}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
  onMarkerLongPress: PropTypes.func.isRequired,
  height: PropTypes.number.isRequired
};

export default Marker;
