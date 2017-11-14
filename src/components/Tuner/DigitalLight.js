import React from "react";
import PropTypes from "prop-types";
import { View, StyleSheet } from "react-native";

const DigitalLight = ({ type, isOn }) => {
  var containerStyle = [styles.triangle, styles.container];
  containerStyle.push(type === "left" ? styles.left : styles.right);
  containerStyle.push(type === "left" ? { left: "22%" } : { right: "22%" });

  var style = [styles.triangle, styles.inset];
  style.push(isOn ? styles.on : styles.off);

  return (
    <View style={containerStyle}>
      <View style={style} />
    </View>
  );
};

DigitalLight.propTypes = {
  type: PropTypes.string.isRequired,
  isOn: PropTypes.bool.isRequired
};

const styles = StyleSheet.create({
  triangle: {
    position: "absolute",
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 20,
    borderRightWidth: 20,
    borderBottomWidth: 40,
    borderLeftColor: "transparent",
    borderRightColor: "transparent"
  },
  container: {
    borderBottomColor: "white",
    bottom: "10%"
  },
  inset: {
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 30,
    top: 7,
    left: -15
  },
  on: {
    borderBottomColor: "red"
  },
  off: {
    borderBottomColor: "#8a0000"
  },
  left: {
    transform: [{ rotate: "-90deg" }]
  },
  right: {
    transform: [{ rotate: "90deg" }]
  }
});

export default DigitalLight;
