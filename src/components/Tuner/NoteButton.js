import React from "react";
import PropTypes from "prop-types";
import { View, TouchableOpacity, Image, Text, StyleSheet } from "react-native";

const NoteButton = ({ note, onPress }) => (
  <TouchableOpacity activeOpacity={0.7} style={styles.view}>
    <Text numberOfLines={1} style={styles.text}>
      {note}
    </Text>
  </TouchableOpacity>
);

NoteButton.propTypes = {
  note: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  view: {
    width: 60,
    height: 60,
    backgroundColor: "#17A3E3",
    borderRadius: 1000,
    alignItems: "center"
  },
  text: {
    height: "100%",
    textAlignVertical: "center",
    fontSize: 18
  }
});

export default NoteButton;
