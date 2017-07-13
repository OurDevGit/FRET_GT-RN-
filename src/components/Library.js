import React from "react";
import { View, FlatList, Text, Button } from "react-native";

const width = 100;

const Library = ({ isOpen, onSelect }) =>
  <View
    style={{
      backgroundColor: "#fff",
      width,
      height: "100%",
      position: "absolute",
      right: isOpen ? 0 : 0 - width
    }}
  >
    <FlatList
      data={[
        { key: "ABC" },
        { key: "About a Girl" },
        { key: "Song 1" },
        { key: "Song 2" },
        { key: "Song 3" },
        { key: "Song 4" },
        { key: "Song 5" },
        { key: "Song 6" },
        { key: "Song 7" },
        { key: "Song 8" },
        { key: "Song 9" },
        { key: "Song 10" }
      ]}
      renderItem={item =>
        <Button title={item.item.key} onPress={() => onSelect(item.index)} />}
    />
  </View>;

export default Library;
