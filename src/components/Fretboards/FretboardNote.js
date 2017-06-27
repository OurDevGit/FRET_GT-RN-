import React from "react";
import { View, Text } from "react-native";

const FretboardNote = ({ isVisible }) => (
  <View
    style={{
      width: "50%",
      aspectRatio: 1
    }}
  >
    {isVisible &&
      <View
        style={{
          flex: 1,
          backgroundColor: "#17A3E3",
          borderRadius:8,
          alignItems: "center"
        }}
      >
        <Text style={{ fontSize: 10 }}>C♭</Text>
      </View>
    }
  </View>
);

export default FretboardNote;
