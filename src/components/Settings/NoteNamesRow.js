import React from "react";
import PropTypes from "prop-types";
import { View, Text, TouchableOpacity } from "react-native";
import { PrimaryBlue } from "../../design";

const NoteNamesRow = ({ label, currentNoteName, onPress }) => (
  <View
    style={{
      flex: 1,
      justifyContent: "row"
    }}
  >
    <Text style={{ fontSize: 12 }}>{label}</Text>
    <TouchableOpacity onPress={onPress}>
      <Text style={{ fontSize: 12 }}>{currentNoteName}</Text>
    </TouchableOpacity>
    <Switch onTintColor={PrimaryBlue} onValueChange={onSwitch} />
  </View>
);

NoteNamesRow.propTypes = {
  label: PropTypes.string.isRequired,
  currentNoteName: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired
};

export default NoteNamesRow;
