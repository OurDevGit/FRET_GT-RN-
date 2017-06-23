import React from "react";
import { View, Text } from "react-native";

const size = 15;

const FretboardNote = () => (
  <View
    style={{
      width: size,
      height: size,
      marginTop: 2,
      marginBottom: 2,
      backgroundColor: "#17A3E3",
      borderRadius: size / 2,
      alignItems: "center"
    }}
  >
    <Text style={{ fontSize: 10 }}>C♭</Text>
  </View>
);

export default FretboardNote;
