import React, { Component } from "react";
import PropTypes from "prop-types";
import { TouchableWithoutFeedback } from "react-native";

import BSTestView from "./BSTestView";

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
        <BSTestView
          drawMethod={this.props.drawMethod}
          drawArgs={this.state.nativeArgs}
          style={this.props.style}
        />
      </TouchableWithoutFeedback>
    );
  }

  componentWillMount() {
    const nativeArgs = this.makeNativeArgs(this.props, this.props.drawArgs);

    const newState = {
      nativeArgs
    };

    this.setState(newState);
  }

  componentWillReceiveProps(newProps) {
    const nativeArgs = this.makeNativeArgs(newProps, this.props.drawArgs);

    const newState = {
      nativeArgs
    };

    this.setState(newState);
  }

  makeNativeArgs = (props, args = []) => {
    const nativeArgs = args.map(arg => {
      const p = arg === "isPressed" ? this.state.isPressed : props[arg];
      console.log(arg, p);
      return p !== undefined ? p : null;
    });

    return nativeArgs;
  };

  handleTouchDown = () => {
    this.setState({ isPressed: true });
  };

  handleTouchUp = () => {
    this.setState({ isPressed: false });
  };
}

PaintCodeButton.propTypes = {
  drawMethod: PropTypes.string.isRequired,
  drawArgs: PropTypes.arrayOf(PropTypes.string)
};

export default PaintCodeButton;
