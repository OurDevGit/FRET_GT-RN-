import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, PanResponder } from "react-native";
import { PrimaryBlue } from "../../../design";

class Playline extends Component {
  state = {
    dragLeft: 0
  };

  render() {
    console.log(this.props.scrollLeft);
    return (
      <View
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%"
        }}
      >
        <View
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: this.props.scrollLeft,
            height: 4,
            backgroundColor: PrimaryBlue
          }}
          {...this._panResponder.panHandlers}
        />
      </View>
    );
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        this.setState({
          dragLeft: this.props.scrollLeft
        });

        this.props.onPanStart();
      },
      onPanResponderMove: (evt, gestureState) => {
        this.props.onPan(this.state.dragLeft + gestureState.dx);
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        this.props.onPanEnd();
      },
      onPanResponderTerminate: (evt, gestureState) => {
        this.props.onPan(this.state.dragLeft);
        this.props.onPanEnd();
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        return true;
      }
    });
  }
}

Playline.propTypes = {
  onPan: PropTypes.func.isRequired,
  onPanStart: PropTypes.func.isRequired,
  onPanEnd: PropTypes.func.isRequired,
  scrollLeft: PropTypes.number.isRequired
};

export default Playline;
