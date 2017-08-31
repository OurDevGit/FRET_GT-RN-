import React, { Component } from "react";
import { TouchableOpacity } from "react-native";

class MeasurableButton extends React.Component {
  render() {
    return (
      <TouchableOpacity ref="Touchable" onPress={this.handlePress}>
        {this.props.children}
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

export default MeasurableButton;
