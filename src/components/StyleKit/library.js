import React, { Component } from "react";
import { View } from "react-native";
import { PaintCode, PaintCodeButton, PaintCodeButtonWithColor } from "./lib";

export const BtnBuy = ({ text, fontSize, width, height }) => {
  return (
    <PaintCodeButton
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
