import React, { Component } from "react";
import { View } from "react-native";
import { PaintCode, PaintCodeButton, PaintCodeButtonWithColor } from "./lib";
import { BuyButton_priceText_fontSize_topText_bottomText } from "./styleKitComponents";

export const BtnBuy = props => {
  return (
    <BuyButton_priceText_fontSize_topText_bottomText
      {...props}
      style={{ width: 78 }}
    />
  );
};
