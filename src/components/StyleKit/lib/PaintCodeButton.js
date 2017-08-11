import React, { Component } from "react";
import PropTypes from "prop-types";
import { TouchableWithoutFeedback } from "react-native";
import PaintCode from "./PaintCode";

class PaintCodeButton extends Component {
  state = {
    isPressed: false
  };

  render() {
    const pcbProps = {
      ...{ drawArgs: ["isPressed"] },
      ...this.props,
      ...this.state
    };
    console.log(pcbProps);
    return (
      <TouchableWithoutFeedback
        onPressIn={this.handleTouchDown}
        onPressOut={this.handleTouchUp}
        style={{ flex: 1 }}
      >
        <PaintCode drawArgs={this.state.buttonArgs} {...pcbProps} />
      </TouchableWithoutFeedback>
    );
  }

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
