import React from "react";
import PaintCode from "./PaintCode";
import { Text } from "react-native";

export const Heart = ({ isPressed }) => {
  return (
    // <Text>Heart</Text>
    <PaintCode
      drawMethod="BtnFavorite"
      isPressed={isPressed}
      style={{ width: 20, height: 20 }}
    />
  );
};
