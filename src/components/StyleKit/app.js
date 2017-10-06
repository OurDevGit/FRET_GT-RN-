import React, { Component } from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import { gtPcPressable, gtPcColorable, gtPcSizeable } from "./lib";
import {
  BtnLibrary_isPressed,
  BtnDetails_isPressed
} from "./styleKitComponents";
import {
  ResizingBehavior,
  SizePropType,
  ResizingBehaviorPropType
} from "./lib";

export const BtnLibrary = props => {
  const Comp = gtPcPressable(BtnLibrary_isPressed);

  return <Comp {...props} />;
};

export const BtnDetails = props => {
  const Comp = gtPcPressable(BtnDetails_isPressed);

  return <Comp {...props} style={{ width: 44, height: 44 }} />;
};
