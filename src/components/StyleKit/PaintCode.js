import React, { Component } from "react";
import PropTypes from "prop-types";

import BSTestView from "./BSTestView";

class PaintCode extends Component {
  state = {
    // nativeProps: {},
    nativeArgs: []
  };

  render() {
    console.log(this.state);
    return (
      <BSTestView
        drawMethod={this.props.drawMethod}
        drawArgs={this.state.nativeArgs}
        style={this.props.style}
      />
    );
  }

  componentWillMount() {
    // const nativeProps = this.makeNativeProps(this.props);
    const nativeArgs = this.makeNativeArgs(this.props, this.props.drawArgs);

    const newState = {
      // nativeProps,
      nativeArgs
    };

    console.log({ newState });

    this.setState(newState);
  }

  componentWillReceiveProps(newProps) {
    // const nativeProps = this.makeNativeProps(newProps);
    const nativeArgs = this.makeNativeArgs(newProps, this.props.drawArgs);

    const newState = {
      // nativeProps,
      nativeArgs
    };

    console.log({ newState });

    this.setState(newState);
  }

  // makeNativeProps = props => {
  //   var nativeProps = { ...props };
  //   delete nativeProps.drawMethod;
  //   delete nativeProps.style;

  //   return nativeProps;
  // };

  makeNativeArgs = (props, args = []) => {
    const nativeArgs = args.map(arg => {
      const p = props[arg];
      return p !== undefined ? p : null;
    });

    return nativeArgs;
  };
}

PaintCode.propTypes = {
  drawMethod: PropTypes.string.isRequired,
  drawArgs: PropTypes.arrayOf(PropTypes.string)
};

export default PaintCode;
