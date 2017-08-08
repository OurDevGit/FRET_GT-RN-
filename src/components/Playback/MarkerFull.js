import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { PrimaryBlue } from "../../design";

const Marker = ({ marker, left, onMarkerPress, onMarkerLongPress }) =>
  <TouchableOpacity
    key={marker.name}
    style={{
      position: "absolute",
      top: 0,
      left: left,
      height: "100%",
      alignItems: "flex-end"
    }}
    onPress={() => {
      onMarkerPress(marker.time);
    }}
    onLongPress={() => {
      onMarkerLongPress(marker.time, end);
    }}
  >
    <View style={{ width: 2, height: 15, backgroundColor: PrimaryBlue }} />
    <Text
      style={{
        fontSize: 16,
        marginTop: 10,
        textAlign: "right",
        transform: [{ rotate: "-45deg" }]
      }}
    >
      {marker.name}
    </Text>
  </TouchableOpacity>;

export default Marker;
