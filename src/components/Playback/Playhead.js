import React, { Component } from "react";
import PropTypes from 'prop-types';
import { View, PanResponder } from "react-native";

const styles = {
  circle: {
    position: "absolute",
    width: 18,
    height: 18,
    borderRadius: 18 / 2,
    backgroundColor: "black"
  }
};

class Playhead extends Component {
  state = {
    dragLeft: 0
  };

  render() {
    const styleWithLeft = {
      ...styles.circle,
      left: this.props.left
    };
    return <View style={styleWithLeft} {...this._panResponder.panHandlers} />;
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        // The guesture has started. Show visual feedback so the user knows
        // what is happening!

        // gestureState.d{x,y} will be set to zero now
        console.log("grant!");

        this.setState({
          dragLeft: this.props.left
        });

        this.props.onPanStart();
      },
      onPanResponderMove: (evt, gestureState) => {
        // The most recent move distance is gestureState.move{X,Y}

        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}

        this.props.onPan(this.state.dragLeft + gestureState.dx);
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded

        this.props.onPanEnd();
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled

        this.props.onPan(this.state.dragLeft);
        this.props.onPanEnd();
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      }
    });
  }
}

Playhead.propTypes = {
  onPan: PropTypes.func.isRequired,
  onPanStart: PropTypes.func.isRequired,
  onPanEnd: PropTypes.func.isRequired,
  left: PropTypes.number.isRequired
};

export default Playhead;
