import React, { Component } from "react";
import { View } from "react-native";
import { PaintCode, PaintCodeButton, gtPcButton } from "./lib";
import { BtnFavorite_isPressed } from "./styleKitComponents";

export const BtnPlay = props => {
  return (
    <PaintCodeButtonWithColor
      //drawBtnPlay(Canvas canvas, boolean isPressed, boolean isShowingPause, float redValue, float greenValue, float blueValue) {
      drawMethod="BtnPlay"
      drawArgs={[
        "isPressed",
        "isShowingPause",
        "redValue",
        "greenValue",
        "blueValue"
      ]}
      {...props}
    />
  );
};

export const Heart = () => {
  const BtnFavorite = gtPcButton(BtnFavorite_isPressed);
  return <BtnFavorite style={{ width: 20, height: 20 }} />;
};
