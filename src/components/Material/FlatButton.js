import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

export const FlatButton = ({ title, onPress, style }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.flatButton}>
      <Text style={{ color: style.color }}>{title.toUpperCase()}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  flatButton: {
    padding: 8,
    minHeight: 36,
    minWidth: 64,
    margin: 8
  }
});
