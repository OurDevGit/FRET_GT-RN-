import React from "react";
import { View, FlatList, Text, Button } from "react-native";

const width = 100;

const Library = ({ isOpen, onSelect, songs }) =>
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
      data={songs.map(song => Object.assign(song, { key: song.name }))}
      renderItem={item =>
        <Button title={item.item.name} onPress={() => onSelect(item.index)} />}
    />
  </View>;

export default Library;
