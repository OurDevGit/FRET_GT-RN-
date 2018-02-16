import React from "react";
import PropTypes from "prop-types";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { PrimaryBlue } from "../../design";
import { BtnPhoneBluetooth } from "../StyleKit";

const BtnFretlightAdmin = ({ isPhone, guitars, buttonStyle, onPress }) => (
  <TouchableOpacity style={[styles.button, buttonStyle]} onPress={onPress}>
    {isPhone ? (
      <BtnPhoneBluetooth style={{ width: 36, height: 36 }} color={"#FFFFFF"} />
    ) : (
      <Text style={styles.text}>Fretlight Status</Text>
    )}
    <Text style={styles.text}>({guitars})</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    flex: -1,
    flexDirection: "row",
    marginHorizontal: 6,
    paddingTop: 0,
    paddingRight: 8,
    paddingLeft: 8,
    paddingHorizontal: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: PrimaryBlue,
    borderRadius: 6
  },
  text: {
    marginTop: -4,
    fontSize: 20,
    color: "white",
    lineHeight: 22
  }
});

BtnFretlightAdmin.propTypes = {
  isPhone: PropTypes.bool.isRequired,
  buttonStyle: PropTypes.number,
  guitars: PropTypes.number.isRequired,
  onPress: PropTypes.func.isRequired
};

export default BtnFretlightAdmin;
