import React, { Component } from "react";
import PropTypes from "prop-types";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { doDebugPcButtons } from "../../../Config";

export const gtPcPressable = WrappedComponent => {
  class PaintCodePressable extends Component {
    render() {
      const pressableProps = {
        ...this.props,
        isPressed: false
      };

      delete pressableProps.onPress;

      return (
        <TouchableOpacity
          disabled={this.props.disabled || false}
          onPress={this.handlePress}
        >
          <View style={doDebugPcButtons ? styles.buttonDebug : styles.button}>
            <WrappedComponent {...pressableProps} />
          </View>
        </TouchableOpacity>
      );
    }

    handlePress = e => {
      if (typeof this.props.onPress === "function") {
        this.props.onPress(e);
      }
    };
  }

  PaintCodePressable.propTypes = {
    disabled: PropTypes.bool,
    onPress: PropTypes.func
  };

  return PaintCodePressable;
};

const styles = StyleSheet.create({
  button: {},
  buttonDebug: { backgroundColor: "rgba(255, 255, 0, 0.66)" }
});
