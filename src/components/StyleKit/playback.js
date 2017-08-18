import React, { Component } from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import { gtPcPressable, gtPcColorable, gtPcSizeable } from "./lib";
import {
  BtnFavorite_isPressed,
  BtnPlay_isPressed_isShowingPause_redValue_greenValue_blueValue,
  BtnPlay_targetFrame_resizing_isPressed_isShowingPause_redValue_greenValue_blueValue
} from "./styleKitComponents";
import {
  ResizingBehavior,
  SizePropType,
  ResizingBehaviorPropType
} from "./lib";

export const BtnPlay = props => {
  const Comp = gtPcSizeable(
    gtPcColorable(
      gtPcPressable(
        BtnPlay_targetFrame_resizing_isPressed_isShowingPause_redValue_greenValue_blueValue
      )
    )
  );

  return <Comp {...props} />;
};

BtnPlay.propTypes = {
  size: SizePropType,
  resizing: ResizingBehaviorPropType
};

export const Heart = props => {
  const BtnFavorite = gtPcPressable(BtnFavorite_isPressed);
  return <BtnFavorite style={{ width: 20, height: 20 }} {...props} />;
};
