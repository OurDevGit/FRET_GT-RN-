import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { View, PanResponder } from "react-native";

const styles = {
  circle: {
    position: "absolute",
    top: 15,
    width: 40,
    height: 40,
    backgroundColor: "rgba(0, 0, 0, 0)"
  }
};

class Playhead extends Component {
  state = {
    dragLeft: 0
  };

  render() {
    const styleWithLeft = {
      ...styles.circle,
      left: this.props.scrollLeft
    };
    // console.log(this.props.scrollLeft, this.props.containerLeft)
    return (
      <View
        style={{
          position: "absolute",
          top: 0,
          left: this.props.containerLeft,
          width: this.props.width,
          height: 18
        }}
      >
        <View style={styleWithLeft} {...this._panResponder.panHandlers}>
          <View
            style={{
              width: 18,
              height: 18,
              borderRadius: 18 / 2,
              backgroundColor: "black"
            }}
          >
            {this.props.guitars.count() > 0 && (
              <View
                style={{
                  marginHorizontal: "15%",
                  marginVertical: "15%",
                  width: "70%",
                  height: "70%",
                  borderRadius: 10,
                  backgroundColor: "rgba(181, 0, 0, 0.6)"
                }}
              >
                <View
                  style={{
                    marginHorizontal: "15%",
                    marginVertical: "15%",
                    width: "70%",
                    height: "70%",
                    borderRadius: 10,
                    backgroundColor: "rgba(181, 0, 0, 0.6)"
                  }}
                >
                  <View
                    style={{
                      marginHorizontal: "15%",
                      marginVertical: "15%",
                      width: "70%",
                      height: "70%",
                      borderRadius: 10,
                      backgroundColor: "rgba(181, 0, 0, 1.0)"
                    }}
                  />
                </View>
              </View>
            )}
          </View>
        </View>
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
        // console.log("grant!");

        this.setState({
          dragLeft: this.props.scrollLeft
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
  guitars: PropTypes.object,
  onPan: PropTypes.func.isRequired,
  onPanStart: PropTypes.func.isRequired,
  onPanEnd: PropTypes.func.isRequired,
  scrollLeft: PropTypes.number.isRequired,
  containerLeft: PropTypes.number.isRequired
};

const mapStateToProps = state => {
  return {
    guitars: state.get("guitars")
  };
};

export default connect(mapStateToProps)(Playhead);
