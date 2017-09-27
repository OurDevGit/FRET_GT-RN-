import React, { Component } from "react";
import { View } from "react-native";
import { PaintCode, PaintCodeButton, PaintCodeButtonWithColor } from "./lib";
import {
  BuyButton_priceText_fontSize_topText_bottomText,
  BtnCloudDownload,
  CircularProgress_angle,
  IndeterminateCircle_angle
} from "./styleKitComponents";

export const BtnBuy = props => {
  return (
    <BuyButton_priceText_fontSize_topText_bottomText
      {...props}
      style={{ width: 78 }}
    />
  );
};

export const GetMediaButtonMode = {
  Purchase: "purchaseMode",
  ComingSoon: "comingSoonMode",
  Download: "downloadMode",
  Downloading: "downloadingMode",
  Indetermindate: "indeterminateMode"
};

export const BtnGetMedia = ({ mode, price = "ERR", angle, ...rest }) => {
  switch (mode) {
    case GetMediaButtonMode.Purchase:
      return (
        <BtnBuy priceText={price} fontSize={14} topText="" bottomText="" />
      );
    case GetMediaButtonMode.ComingSoon:
      return (
        <BtnBuy priceText="" fontSize={14} topText="COMING" bottomText="SOON" />
      );
    case GetMediaButtonMode.Download:
      return <BtnCloudDownload />;
    case GetMediaButtonMode.Downloading:
      return <CircularProgress_angle angle={rest.angle} />;
    case GetMediaButtonMode.Indetermindate:
      return <IndeterminateCircle_angle angle={0} />;
    default:
      break;
  }
};
