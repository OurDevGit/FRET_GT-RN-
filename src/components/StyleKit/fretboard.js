import React, { Component } from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import { gtPcPressable, gtPcColorable, gtPcSizeable } from "./lib";
import { Capo_targetFrame_resizing } from "./styleKitComponents";
import {
  ResizingBehavior,
  SizePropType,
  ResizingBehaviorPropType
} from "./lib";

export const FretCapo = props => {
  const Comp = gtPcSizeable(Capo_targetFrame_resizing);

  return <Comp {...props} resizing={ResizingBehavior.Stretch} />;
};
