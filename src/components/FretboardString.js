import React from "react";
import { View } from "react-native";
import FretboardNote from "./FretboardNote";

const FretboardString = ({ style }) => (
  <View
    style={{ ...style, flexDirection: "row", justifyContent: "space-between" }}
  >
    <FretboardNote />
    <FretboardNote />
    <FretboardNote />
    <FretboardNote />
    <FretboardNote />
    <FretboardNote />
    <FretboardNote />
    <FretboardNote />
    <FretboardNote />
    <FretboardNote />
    <FretboardNote />
    <FretboardNote />
    <FretboardNote />
    <FretboardNote />
    <FretboardNote />
    <FretboardNote />
    <FretboardNote />
    <FretboardNote />
    <FretboardNote />
    <FretboardNote />
    <FretboardNote />
    <FretboardNote />
  </View>
);

export default FretboardString;
