import React, { Component } from "react";
import { TouchableOpacity, Text } from "react-native";

class BtnMyLoops extends React.Component {
  render() {
    return (
      <TouchableOpacity ref="Touchable" onPress={this.handlePress}>
        <Text style={this.props.style}>My Loops</Text>
      </TouchableOpacity>
    );
  }

  handlePress = () => {
    this.refs.Touchable.measure((fx, fy, width, height, px, py) => {
      const frame = { x: px, y: py, width, height };
      this.props.onPress(frame);
    });
  };
}

export default BtnMyLoops;
