import React, { Component } from "react";
import PropTypes from "prop-types";
import { TouchableOpacity } from "react-native";

class ModalButton extends React.Component {
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

ModalButton.propTypes = {
  children: PropTypes.array.isRequired,
  onPress: PropTypes.func.isRequired
};

export default ModalButton;
