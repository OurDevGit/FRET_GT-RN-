import React from "react";
import PropTypes from "prop-types";
import Dimensions from "Dimensions";
import { Modal, Image, StyleSheet, Text, TouchableOpacity } from "react-native";

const AboutModal = ({ onClose }) => {
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;
  const isPhone = height < 500;
  const source = isPhone
    ? require("../../images/about-phone.jpg")
    : require("../../images/about-tablet.jpg");
  const packageJson = require("../../../package.json");

  return (
    <Modal animationType="slide" transparent={true} onRequestClose={onClose}>
      <TouchableOpacity
        style={{ width, height, backgroundColor: "black" }}
        onPress={onClose}
        activeOpacity={1}
      >
        <Image style={styles.image} source={source} resizeMode="contain" />
        <Text style={styles.label}>{`Version ${packageJson.version} (${
          packageJson.build
        })`}</Text>
      </TouchableOpacity>
    </Modal>
  );
};

AboutModal.propTypes = {
  onClose: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  image: {
    position: "absolute",
    width: "100%",
    height: "100%"
  },
  label: {
    position: "absolute",
    top: 4,
    width: "100%",
    fontSize: 14,
    color: "white",
    textAlign: "center"
  }
});

export default AboutModal;
