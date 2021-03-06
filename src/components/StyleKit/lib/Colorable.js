import React, { Component } from "react";
import PropTypes from "prop-types";

// TODO: this hasn't been tested yet! So it may be broken or incomplete

export const gtPcColorable = WrappedComponent => {
  return class PaintCodeColorable extends Component {
    state = {
      redValue: 1,
      greenValue: 0,
      blueValue: 1
    };

    render() {
      const propsWithState = { ...this.props, ...this.state };
      return <WrappedComponent {...propsWithState} />;
    }

    componentWillMount() {
      this.setState(this.makeColor(this.props));
    }

    componentWillReceiveProps(newProps) {
      this.setState(this.makeColor(newProps));
    }

    makeColor = props => {
      const hex = props.color || "#ff00ff";
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
  };
};
