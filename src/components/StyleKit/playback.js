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

export const BtnBuy = ({ text, fontSize, width, height }) => {
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

export const Heart = ({ isPressed }) => {
  return (
    <PaintCode
      drawMethod="BtnFavorite"
      isPressed={isPressed}
      style={{ width: 20, height: 20 }}
    />
  );
};
