import React from "react";
import { View, Text } from "react-native";

const size = 12;

const FretboardNote = () => (
  <View
    style={{
      width: size,
      height: size,
      backgroundColor: "#17A3E3",
      borderRadius: size / 2,
      alignItems: "center"
    }}
  >
    <Text style={{ fontSize: 7 }}>C♭</Text>
  </View>
);

export default FretboardNote;
