import React from "react";
import PropTypes from "prop-types";
import { View, TouchableOpacity, Image, Text, StyleSheet } from "react-native";

const NoteButton = ({ index, note, currentIndex, onPress }) => {
  const backgroundColor = index === currentIndex ? "#17A3E3" : "#EEEEEE";

  return (
    <TouchableOpacity
      style={[styles.view, { backgroundColor }]}
      activeOpacity={0.7}
      onPress={() => {
        onPress(note, index);
      }}
    >
      <Text numberOfLines={1} style={styles.text}>
        {note}
      </Text>
    </TouchableOpacity>
  );
};

NoteButton.propTypes = {
  index: PropTypes.number.isRequired,
  note: PropTypes.string.isRequired,
  currentIndex: PropTypes.number.isRequired,
  onPress: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  view: {
    width: 44,
    height: 44,
    borderRadius: 1000,
    alignItems: "center"
  },
  text: {
    height: "100%",
    textAlignVertical: "center",
    fontSize: 22
  }
});

export default NoteButton;
