import React, { Component } from "react";
import PropTypes from 'prop-types';
import { View, PanResponder } from "react-native";
import { subscribeToTimeUpdates } from "../../time-store";

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
    dragLeft: 0,
    left: 0,
    ignoreTimeProgress: false
  };

  render() {
    const styleWithLeft = {
      ...styles.circle,
      left: this.state.left
    };
    
    return (
      <View style={{position: "absolute", top: 0, left: this.props.left, width: this.props.width, height: 18}}>
        <View style={styleWithLeft} {...this._panResponder.panHandlers} />
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
        // The guesture has started. Show visual feedback so the user knows
        // what is happening!

        // gestureState.d{x,y} will be set to zero now
        this.setState({
          dragLeft: this.state.left
        });

        this.handlePanStart();
      },
      onPanResponderMove: (evt, gestureState) => {
        // The most recent move distance is gestureState.move{X,Y}

        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}

        this.handlePan(this.state.dragLeft + gestureState.dx);
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded

        this.handlePanEnd();
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled

        this.handlePan(this.state.dragLeft);
        this.handlePanEnd();
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      }
    });
  }

  updateTimeSubscription() {
    subscribeToTimeUpdates((payload) => {
      const {time, progress, duration} = payload

      if (this.state.ignoreTimeProgress === false) {
        const left = 
        this.setState({ left: this.props.width * progress})
      }
    })
  }

  componentDidMount() {
    this.updateTimeSubscription()
  }

  componentWillReceiveProps(newProps) {
    if (newProps.duration !== this.props.duration) {
      this.updateTimeSubscription()
    }
  }

  handlePan = x => {
    var progress = x > 0 ? x / this.props.width : 0;
    progress = Math.max(progress, 0)
    progress = Math.min(progress, 1)
    this.setState({ left: this.props.width * progress})
    this.props.onScrub(progress);
  };

  handlePanStart = () => {
    this.setState({ ignoreTimeProgress: true });
  };

  handlePanEnd = () => {
    this.setState({ ignoreTimeProgress: false });
  };
}

Playhead.propTypes = {
  onScrub: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired
};

export default Playhead;
