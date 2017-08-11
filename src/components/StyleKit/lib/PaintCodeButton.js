import React, { Component } from "react";
import PropTypes from "prop-types";
import { TouchableWithoutFeedback } from "react-native";
import PaintCode from "./PaintCode";

class PaintCodeButton extends Component {
  state = {
    isPressed: false,
    redValue: 1,
    greenValue: 0,
    blueValue: 1
  };

  render() {
    return (
      <TouchableWithoutFeedback
        onPressIn={this.handleTouchDown}
        onPressOut={this.handleTouchUp}
        style={{ flex: 1 }}
      >
        <PaintCode
          {...{ ...this.props, ...this.state }}
          drawArgs={this.state.buttonArgs}
        />
      </TouchableWithoutFeedback>
    );
  }

  componentWillMount() {
    this.setState(this.makeColor(this.props));
  }

  componentWillReceiveProps(newProps) {
    this.setState(this.makeColor(newProps));
  }

  makeColor = props => {
    const hex = this.props.color || "#ff00ff";
    const rgb = this.hexToRgb(hex);

    return {
      redValue: rgb.r,
      greenValue: rgb.g,
      blueValue: rgb.b
    };
  };

  hexToRgb = hex => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16) / 255,
          g: parseInt(result[2], 16) / 255,
          b: parseInt(result[3], 16) / 255
        }
      : null;
  };

  handleTouchDown = () => {
    this.setState({ isPressed: true });
  };

  handleTouchUp = () => {
    this.setState({ isPressed: false });

    if (this.props.onPress !== undefined) {
      this.props.onPress();
    }
  };
}

PaintCodeButton.propTypes = {
  drawMethod: PropTypes.string.isRequired,
  drawArgs: PropTypes.arrayOf(PropTypes.string)
};

export default PaintCodeButton;
