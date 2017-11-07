import React from "react";
import PropTypes from "prop-types";
import { TouchableOpacity, Text, Switch, StyleSheet } from "react-native";
import { PrimaryBlue } from "../../design";

const SwitchRow = ({ label, isOn, onSwitch }) => (
  <TouchableOpacity activeOpacity={1} style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Switch value={isOn} onTintColor={PrimaryBlue} onValueChange={onSwitch} />
  </TouchableOpacity>
);

SwitchRow.propTypes = {
  label: PropTypes.string.isRequired,
  isOn: PropTypes.bool.isRequired,
  onSwitch: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  row: {
    flex: 1,
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: "lightgray",
    borderBottomWidth: 1,
    alignItems: "center",
    paddingHorizontal: 20
  },
  label: { fontSize: 18 }
});

export default SwitchRow;
