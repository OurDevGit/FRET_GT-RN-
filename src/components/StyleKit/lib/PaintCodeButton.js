import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, TouchableWithoutFeedback } from "react-native";
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
    // console.log("touchable");
    return (
      <TouchableWithoutFeedback
        onPressIn={this.handleTouchDown}
        onPressOut={this.handleTouchUp}
      >
        <View
          style={{
            ...this.props.style,
            justifyContent: "center",
            alignContent: "center",
            backgroundColor: "red"
          }}
        >
          <PaintCode drawArgs={this.state.buttonArgs} {...pcbProps} />
        </View>
      </TouchableWithoutFeedback>
    );
  }

  handleTouchDown = () => {
    console.log("down");
    this.setState({ isPressed: true });
  };

  handleTouchUp = () => {
    this.setState({ isPressed: false });
    console.log("up", this.props.onPress);
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
