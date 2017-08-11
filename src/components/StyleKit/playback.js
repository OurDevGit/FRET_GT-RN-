import React, { Component } from "react";
import { PaintCode, PaintCodeButton, hexToRgb } from "./lib";

module.exports.BtnPlay = ({ isPressed, isShowingPause, color, style }) => {
  const rgb = hexToRgb(color);
  return (
    <PaintCodeButton
      //drawBtnPlay(Canvas canvas, boolean isPressed, boolean isShowingPause, float redValue, float greenValue, float blueValue) {
      drawMethod="BtnPlay"
      drawArgs={[
        "isPressed",
        "isShowingPause",
        "redValue",
        "greenValue",
        "blueValue"
      ]}
      isPressed={isPressed}
      isShowingPause={isShowingPause}
      redValue={rgb.r}
      greenValue={rgb.g}
      blueValue={rgb.b}
      style={style}
    />
  );
};
