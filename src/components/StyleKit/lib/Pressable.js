import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  TouchableWithoutFeedback,
  TouchableOpacity,
  TouchableNativeFeedback,
  View
} from "react-native";
import PaintCode from "./PaintCode";

export const gtPcPressable = WrappedComponent => {
  return class extends Component {
    state = {
      isPressed: false
    };

    render() {
      const pcbProps = {
        ...this.props,
        ...this.state
      };

      delete pcbProps.onPress;

      return (
        <TouchableWithoutFeedback
          onPressIn={this.handlePressIn}
          onPress={this.handlePress}
          style={{ flex: 1 }}
        >
          <View>
            <WrappedComponent {...pcbProps} />
          </View>
        </TouchableWithoutFeedback>
      );
    }

    handlePressIn = () => {
      this.setState({ isPressed: true });
    };

    handlePress = e => {
      this.setState({ isPressed: false });

      if (typeof this.props.onPress === "function") {
        this.props.onPress(e);
      }
    };
  };
};