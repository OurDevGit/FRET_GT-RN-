import React, { Component } from "react";
import { View, Text } from "react-native";
import {
  PaintCode,
  PaintCodeButton,
  PaintCodeButtonWithColor,
  gtPcSizeable,
  ResizingBehavior
} from "./lib";
import {
  BuyButton_priceText_fontSize_topText_bottomText,
  BtnCloudDownload_targetFrame_resizing,
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

const BtnDownload = props => {
  const Comp = gtPcSizeable(BtnCloudDownload_targetFrame_resizing);

  return <Comp {...props} resize={ResizingBehavior.Stretch} />;
};

const BtnDownloading = ({ progress }) => {
  return <Text>{progress}</Text>;
  // const angle = progress / 360;
  // return (
  //   <CircularProgress_angle angle={angle} style={{ width: 44, height: 44 }} />
  // );
};

export const BtnGetMedia = ({ mode, price = "ERR", progress, ...rest }) => {
  // hard-returning the download button for debugging right now...
  // return (
  //   <BtnCloudDownload
  //     style={{ backgroundColor: "#dfd", height: 44, width: 44 }}
  //   />
  // );

  switch (mode) {
    case GetMediaButtonMode.Play:
      return <View />;
    case GetMediaButtonMode.Purchase:
      return (
        <BtnBuy
          priceText={price}
          fontSize={14}
          topText=""
          bottomText=""
          style={{ backgroundColor: "green" }}
        />
      );
    case GetMediaButtonMode.ComingSoon:
      return (
        <BtnBuy priceText="" fontSize={14} topText="COMING" bottomText="SOON" />
      );
    case GetMediaButtonMode.Download:
      return <BtnDownload style={{ backgroundColor: "blue" }} />;
    case GetMediaButtonMode.Downloading:
      return <BtnDownloading progress={progress} />;
    case GetMediaButtonMode.Indetermindate:
      return <IndeterminateCircle_angle angle={0} />;
    default:
      break;
  }
};
