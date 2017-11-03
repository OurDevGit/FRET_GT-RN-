import React, { Component } from "react";
import { Animated, View, Text, StyleSheet } from "react-native";
import Dimensions from "Dimensions";
import PropTypes from "prop-types";

class CountdownTimer extends Component {
  state = {
    number: 0,
    numAnim: new Animated.Value(0)
  };

  render() {
    const { number, numAnim } = this.state;
    console.log(number, numAnim);
    return (
      <View style={styles.container}>
        <Animated.Text style={[styles.number, { fontSize: numAnim }]}>
          {number}
        </Animated.Text>
      </View>
    );
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ number: 3 });
      this.shrinkNumber();
      setTimeout(() => this.updateCount(), 850);
    });
  }

  shrinkNumber = () => {
    const fontSize = Dimensions.get("window").height * 0.6;
    this.setState({ numAnim: new Animated.Value(fontSize) });
    Animated.timing(this.state.numAnim, {
      toValue: 1,
      duration: 850
    }).start();
  };

  updateCount = () => {
    if (this.state.number > 1) {
      this.setState({ number: this.state.number - 1 });
      this.shrinkNumber();
      setTimeout(() => this.updateCount(), 850);
    } else {
      this.props.onComplete(false);
    }
  };
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(96, 194, 212, 0.3)"
  },
  number: {
    flex: 1,
    color: "#3C7782",
    fontWeight: "800",
    marginHorizontal: 4,
    textAlign: "center",
    textAlignVertical: "center"
  }
});

CountdownTimer.propTypes = {
  onComplete: PropTypes.func.isRequired
};

export default CountdownTimer;
