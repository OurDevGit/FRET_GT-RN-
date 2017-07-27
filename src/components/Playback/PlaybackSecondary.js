import React from "react";
import { View, Picker } from "react-native";
import RatePicker from "./RatePicker";

const PlaybackSecondary = ({ rate, onRateChange }) =>
  <View
    style={{
      width: "100%",
      height: 30,
      flexDirection: "row",
      alignContent: "flex-start"
    }}
  >
    <View
      style={{ width: 110, height: "100%", marginTop: -10, marginBottom: -5 }}
    >
      <RatePicker rate={rate} onRateChange={onRateChange} />
    </View>
  </View>;

export default PlaybackSecondary;
