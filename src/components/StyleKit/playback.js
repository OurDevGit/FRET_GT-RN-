import React, { Component } from "react";
import { PaintCode, PaintCodeButton } from "./lib";

export const BtnPlay = props => {
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
      {...props}
    />
  );
};
