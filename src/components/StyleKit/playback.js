import React, { Component } from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import { gtPcPressable, gtPcColorable } from "./lib";
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
  // return <View />;
  const Comp = gtPcColorable(
    gtPcPressable(
      // BtnPlay_isPressed_isShowingPause_redValue_greenValue_blueValue
      BtnPlay_targetFrame_resizing_isPressed_isShowingPause_redValue_greenValue_blueValue
    )
  );

  const frameProps = {
    ...props,
    targetFrame: {
      left: 0,
      top: 0,
      right: props.size.width,
      bottom: props.size.height
    }
  };

  return <Comp {...frameProps} />;
};

BtnPlay.propTypes = {
  size: SizePropType,
  resizing: ResizingBehaviorPropType
};

export const Heart = props => {
  const BtnFavorite = gtPcPressable(BtnFavorite_isPressed);
  return <BtnFavorite style={{ width: 20, height: 20 }} {...props} />;
};
