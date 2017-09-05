import React, { Component } from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import { gtPcPressable, gtPcColorable, gtPcSizeable } from "./lib";
import {
  BtnLibrary_targetFrame_resizing_isPressed_redValue_greenValue_blueValue,
  BtnDetails_isPressed
} from "./styleKitComponents";
import {
  ResizingBehavior,
  SizePropType,
  ResizingBehaviorPropType
} from "./lib";

export const BtnLibrary = props => {
  const Comp = gtPcSizeable(
    gtPcColorable(
      gtPcPressable(
        BtnLibrary_targetFrame_resizing_isPressed_redValue_greenValue_blueValue
      )
    )
  );

  return <Comp {...props} resizing={ResizingBehavior.AspectFit} />;
};

export const BtnDetails = props => {
  const Comp = gtPcPressable(BtnDetails_isPressed);

  return <Comp {...props} style={{ width: 44, height: 44 }} />;
};
