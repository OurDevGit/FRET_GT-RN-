import React, { Component } from "react";
import PaintCode from "./PaintCode.js";

const hexToRgb = hex => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255
      }
    : null;
};

module.exports.BtnPlay = ({ isPressed, isShowingPause, color, style }) => {
  const rgb = hexToRgb(color);
  return (
    <PaintCode
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

module.exports.BtnBuy = ({ text, fontSize, width, height }) => {
  return (
    <PaintCode
      // drawBuyButton(Canvas canvas, Context context, String priceText, float fontSize, String topText, String bottomText)
      drawMethod="BuyButton"
      drawArgs={["priceText", "fontSize", "topText", "bottomText"]}
      priceText="$1.99"
      fontSize={12}
      topText=""
      bottomText=""
      style={{ width: 50, height: 25 }}
    />
  );
};

//drawBuyButton(Canvas canvas, Context context, RectF targetFrame, ResizingBehavior resizing, String priceText, float fontSize, String topText, String bottomText)
