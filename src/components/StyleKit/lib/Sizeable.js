import React, { Component } from "react";
import PropTypes from "prop-types";

export const gtPcSizeable = WrappedComponent => {
  return class extends Component {
    state = {
      width: 44,
      height: 44
    };

    render() {
      const frameProps = {
        ...this.props,
        targetFrame: {
          left: 0,
          top: 0,
          right: this.state.width,
          bottom: this.state.height
        }
      };

      return <WrappedComponent {...frameProps} />;
    }

    componentWillMount() {
      this.setState(this.makeSize(this.props));
    }

    componentWillReceiveProps(newProps) {
      this.setState(this.makeSize(newProps));
    }

    makeSize = props => {
      const size = props.size || { width: 44, height: 44 };
      return { width: size.width, height: size.height };
    };
  };
};
