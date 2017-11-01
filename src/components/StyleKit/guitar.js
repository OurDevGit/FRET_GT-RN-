import React, { Component } from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import { gtPcPressable, gtPcColorable, gtPcSizeable } from "./lib";
import { IconStatusConnected_targetFrame_resizing } from "./styleKitComponents";
import {
  ResizingBehavior,
  SizePropType,
  ResizingBehaviorPropType
} from "./lib";

export const GuitarConnectedIcon = props => {
  const Comp = gtPcSizeable(IconStatusConnected_targetFrame_resizing);

  return <Comp {...props} resizing={ResizingBehavior.AspectFit} />;
};
