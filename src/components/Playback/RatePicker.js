import React from "react";
import { View, Picker } from "react-native";

const RatePicker = ({ rate, onRateChange }) =>
  <Picker selectedValue={rate} onValueChange={onRateChange} mode="dropdown">
    <Picker.Item label="125%" value={1.25} />
    <Picker.Item label="120%" value={1.2} />
    <Picker.Item label="115%" value={1.15} />
    <Picker.Item label="110%" value={1.1} />
    <Picker.Item label="105%" value={1.05} />
    <Picker.Item label="100%" value={1.0} />
    <Picker.Item label="95%" value={0.95} />
    <Picker.Item label="90%" value={0.9} />
    <Picker.Item label="85%" value={0.85} />
    <Picker.Item label="80%" value={0.8} />
    <Picker.Item label="75%" value={0.75} />
    <Picker.Item label="70%" value={0.7} />
    <Picker.Item label="65%" value={0.65} />
    <Picker.Item label="60%" value={0.6} />
    <Picker.Item label="55%" value={0.55} />
    <Picker.Item label="50%" value={0.5} />
    <Picker.Item label="45%" value={0.45} />
    <Picker.Item label="40%" value={0.4} />
    <Picker.Item label="35%" value={0.35} />
  </Picker>;

export default RatePicker;
