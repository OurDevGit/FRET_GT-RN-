import React from "react";
import PropTypes from "prop-types";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { PrimaryBlue } from "../../design";

const BirthdateRow = ({ savedBirthdate, onPress }) => {
  return (
    <TouchableOpacity activeOpacity={1} style={styles.row}>
      <Text style={styles.label}>User Birthdate</Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.button}>{savedBirthdate}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

BirthdateRow.propTypes = {
  savedBirthdate: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired
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
  label: { fontSize: 18 },
  button: { fontSize: 18, color: PrimaryBlue, marginRight: 10 }
});

export default BirthdateRow;
