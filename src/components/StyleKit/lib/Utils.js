import React, { Component } from "react";
import PropTypes from "prop-types";
import { gtPcPressable, gtPcColorable, gtPcSizeable } from "./index";

export const ResizingBehavior = {
  AspectFit: "ResizingBehavior.AspectFit",
  AspectFill: "ResizingBehavior.AspectFill",
  Stretch: "ResizingBehavior.Stretch",
  Center: "ResizingBehavior.Center"
};

export const SizePropType = PropTypes.shape({
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
});

export const ResizingBehaviorPropType = PropTypes.oneOf([
  ResizingBehavior.AspectFill,
  ResizingBehavior.AspectFit,
  ResizingBehavior.Center,
  ResizingBehavior.Stretch
]);
