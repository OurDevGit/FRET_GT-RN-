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
      width: 30,
      alignItems: "center"
    }}
    onPress={() => {
      onMarkerPress(marker.time);
    }}
    onLongPress={() => {
      onMarkerLongPress(marker.time, end);
    }}
  >
    <View style={{ width: 2, height: 10, backgroundColor: "yellow" }} />
    <Text style={{ fontSize: 12 }}>
      {marker.abbreviation}
    </Text>
  </TouchableOpacity>;

export default Marker;
