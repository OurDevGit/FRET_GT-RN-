import React, { Component } from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import { gtPcPressable, gtPcSizeable } from "./lib";
import {
  BtnPrevious_targetFrame_resizing_isPressed_redValue_greenValue_blueValue,
  BtnLoopLeft_targetFrame_resizing,
  BtnLoopRight_targetFrame_resizing
} from "./styleKitComponents";
import {
  ResizingBehavior,
  SizePropType,
  ResizingBehaviorPropType
} from "./lib";

export const LoopLeft = props => {
  const Comp = gtPcSizeable(gtPcPressable(BtnLoopLeft_targetFrame_resizing));
  return <Comp {...props} resizing={ResizingBehavior.AspectFit} />;
};

export const LoopRight = props => {
  const Comp = gtPcSizeable(gtPcPressable(BtnLoopRight_targetFrame_resizing));
  return <Comp {...props} resizing={ResizingBehavior.AspectFit} />;
};
