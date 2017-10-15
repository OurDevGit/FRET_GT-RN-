import React from "react";
import { View, FlatList, Text, Button } from "react-native";

const width = 100;

const TestLibrary = ({ isOpen, onSelect, media }) => (
  <View
    style={{
      backgroundColor: "#fff",
      width,
      height: "100%",
      position: "absolute",
      left: isOpen ? 0 : 0 - width,
      zIndex: 10000
    }}
  >
    <FlatList
      data={media.map(m => Object.assign(m, { key: m.name }))}
      renderItem={item => (
        <Button title={item.item.name} onPress={() => onSelect(item.index)} />
      )}
    />
  </View>
);

export default TestLibrary;
