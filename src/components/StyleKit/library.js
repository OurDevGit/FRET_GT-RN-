import React, { Component } from "react";
import { View, Text } from "react-native";
import { PaintCode, PaintCodeButton, PaintCodeButtonWithColor } from "./lib";
import {
  BuyButton_priceText_fontSize_topText_bottomText,
  BtnCloudDownload,
  CircularProgress_angle,
  IndeterminateCircle_angle
} from "./styleKitComponents";
import { GetMediaButtonMode } from "../../models/Media";

const BtnBuy = props => {
  return (
    <BuyButton_priceText_fontSize_topText_bottomText
      {...props}
      style={{ width: 78 }}
    />
  );
};

const BtnDownload = () => {
  return <Text>DL</Text>;
  // return <BtnCloudDownload style={{ width: 44, height: 44 }} />;
};

const BtnDownloading = ({ progress }) => {
  return <Text>{progress}</Text>;
  // const angle = progress / 360;
  // return (
  //   <CircularProgress_angle angle={angle} style={{ width: 44, height: 44 }} />
  // );
};

export const BtnGetMedia = ({ mode, price = "ERR", progress, ...rest }) => {
  switch (mode) {
    case GetMediaButtonMode.Play:
      return <View />;
    case GetMediaButtonMode.Purchase:
      return (
        <BtnBuy priceText={price} fontSize={14} topText="" bottomText="" />
      );
    case GetMediaButtonMode.ComingSoon:
      return (
        <BtnBuy priceText="" fontSize={14} topText="COMING" bottomText="SOON" />
      );
    case GetMediaButtonMode.Download:
      return <BtnDownload />;
    case GetMediaButtonMode.Downloading:
      return <BtnDownloading progress={progress} />;
    case GetMediaButtonMode.Indetermindate:
      return <IndeterminateCircle_angle angle={0} />;
    default:
      break;
  }
};
