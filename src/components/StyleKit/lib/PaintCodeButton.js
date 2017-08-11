import React, { Component } from "react";
import PropTypes from "prop-types";
import { TouchableWithoutFeedback } from "react-native";
import PaintCode from "./PaintCode";

class PaintCodeButton extends Component {
  state = {
    // nativeProps: {},
    nativeArgs: [],
    isPressed: false
  };

  render() {
    // console.log(this.state);
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
        {/* <BSTestView
          drawMethod={this.props.drawMethod}
          drawArgs={this.state.nativeArgs}
          style={this.props.style}
        /> */}
      </TouchableWithoutFeedback>
    );
  }

  componentWillMount() {
    const nativeArgs = this.makeNativeArgs(this.props, this.props.drawArgs);
    this.setState({ nativeArgs });
  }

  componentWillReceiveProps(newProps) {
    const nativeArgs = this.makeNativeArgs(newProps, this.props.drawArgs);
    this.setState({ nativeArgs });
  }

  makeNativeArgs = (props, args = []) => {
    const nativeArgs = args.map(arg => {
      var p = props[arg];

      if (arg === "isPressed") {
        p = this.state.isPressed;
      }

      const hex = this.props.color || "#111111";
      const rgb = this.hexToRgb(hex);

      if (arg === "redValue") {
        p = rgb.r;
      }

      if (arg === "greenValue") {
        p = rgb.g;
      }

      if (arg === "blueValue") {
        p = rgb.b;
      }

      return p !== undefined ? p : null;
    });

    return nativeArgs;
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
