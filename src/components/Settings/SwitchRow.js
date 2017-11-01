import React from "react";
import PropTypes from "prop-types";
import { View, Text, Switch } from "react-native";
import { PrimaryBlue } from "../../design";

const SwitchRow = ({ label, isOn, onSwitch }) => (
  <View
    style={{
      flex: 1,
      flexDirection: "row"
    }}
  >
    <Text style={{ fontSize: 12 }}>{label}</Text>
    <Switch value={isOn} onTintColor={PrimaryBlue} onValueChange={onSwitch} />
  </View>
);

SwitchRow.propTypes = {
  label: PropTypes.string.isRequired,
  isOn: PropTypes.bool.isRequired,
  onSwitch: PropTypes.func.isRequired
};

export default SwitchRow;
