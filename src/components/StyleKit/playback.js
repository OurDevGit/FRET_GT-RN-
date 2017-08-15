import React, { Component } from "react";
import { View } from "react-native";
import { gtPcPressable, gtPcColorable } from "./lib";
import {
  BtnFavorite_isPressed,
  BtnPlay_isPressed_isShowingPause_redValue_greenValue_blueValue
} from "./styleKitComponents";

export const BtnPlay = props => {
  // return <View />;
  const MyComp = gtPcColorable(
    gtPcPressable(
      BtnPlay_isPressed_isShowingPause_redValue_greenValue_blueValue
    )
  );

  return <MyComp {...props} />;
};

export const Heart = props => {
  const BtnFavorite = gtPcPressable(BtnFavorite_isPressed);
  return <BtnFavorite style={{ width: 20, height: 20 }} {...props} />;
};
