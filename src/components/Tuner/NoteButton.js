import React from "react";
import PropTypes from "prop-types";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

const NoteButton = ({ index, note, currentIndex, onPress }) => {
  const backgroundColor = index === currentIndex ? "#17A3E3" : "#EEEEEE";
  const chars = note.split("");
  const key = chars[0];
  const step = chars.length > 1 ? chars[1] : "";

  return (
    <TouchableOpacity
      style={[styles.view, { backgroundColor }]}
      activeOpacity={0.7}
      onPress={() => {
        onPress(note, index);
      }}
    >
      {/* TEXT / NOTATION */}
      <View style={styles.text}>
        <Text style={styles.notation} numberOfLines={1}>
          {key}
        </Text>
        <Text style={styles.step}>{step}</Text>
      </View>
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
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "nowrap"
  },
  notation: {
    fontSize: 22,
    textAlign: "right",
    textAlignVertical: "center"
  },
  step: {
    fontFamily: "Titillium Web_bold",
    fontSize: 18,
    textAlign: "left",
    textAlignVertical: "center",
    marginTop: "-8%",
    marginLeft: "-1%"
  }
});

export default NoteButton;
