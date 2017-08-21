import React, { Component } from "react";
import PropTypes from "prop-types";
import { View } from "react-native";

export const gtPcSizeable = WrappedComponent => {
  return class extends Component {
    state = {
      width: 44,
      height: 44
    };

    render() {
      var frameProps = {
        ...this.props,
        targetFrame: {
          left: 0,
          top: 0,
          right: this.state.width,
          bottom: this.state.height
        }
      };
      delete frameProps.style;
      console.log(this.state.width, this.state.height);
      return (
        <View style={this.props.style} onLayout={this.handleLayout.bind(this)}>
          <WrappedComponent {...frameProps} />
        </View>
      );
    }

    handleLayout(e) {
      console.log(e.nativeEvent.layout.height);
      this.setState({
        height: e.nativeEvent.layout.height,
        width: e.nativeEvent.layout.width
      });
    }
  };
};
