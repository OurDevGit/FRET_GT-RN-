import React, { Component } from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import { gtPcPressable, gtPcColorable, gtPcSizeable } from "./lib";
import {
  BtnFavorite_isPressed,
  BtnPrevious_targetFrame_resizing_isPressed_redValue_greenValue_blueValue,
  BtnRewind_targetFrame_resizing_isPressed_redValue_greenValue_blueValue,
  BtnPlay_targetFrame_resizing_isPressed_isShowingPause_redValue_greenValue_blueValue,
  BtnForward_targetFrame_resizing_isPressed_redValue_greenValue_blueValue,
  BtnNext_targetFrame_resizing_isPressed_redValue_greenValue_blueValue
} from "./styleKitComponents";
import {
  ResizingBehavior,
  SizePropType,
  ResizingBehaviorPropType
} from "./lib";

export const BtnPrevious = props => {
  const Comp = gtPcSizeable(
    gtPcColorable(
      gtPcPressable(
        BtnPrevious_targetFrame_resizing_isPressed_redValue_greenValue_blueValue
      )
    )
  );

  return <Comp {...props} resizing={ResizingBehavior.AspectFit} />;
};

export const BtnRewind = props => {
  const Comp = gtPcSizeable(
    gtPcColorable(
      gtPcPressable(
        BtnRewind_targetFrame_resizing_isPressed_redValue_greenValue_blueValue
      )
    )
  );

  return <Comp {...props} resizing={ResizingBehavior.AspectFit} />;
};

export const BtnPlay = props => {
  const Comp = gtPcSizeable(
    gtPcColorable(
      gtPcPressable(
        BtnPlay_targetFrame_resizing_isPressed_isShowingPause_redValue_greenValue_blueValue
      )
    )
  );

  return <Comp {...props} resizing={ResizingBehavior.AspectFit} />;
};

export const BtnForward = props => {
  const Comp = gtPcSizeable(
    gtPcColorable(
      gtPcPressable(
        BtnForward_targetFrame_resizing_isPressed_redValue_greenValue_blueValue
      )
    )
  );

  return <Comp {...props} resizing={ResizingBehavior.AspectFit} />;
};

export const BtnNext = props => {
  const Comp = gtPcSizeable(
    gtPcColorable(
      gtPcPressable(
        BtnNext_targetFrame_resizing_isPressed_redValue_greenValue_blueValue
      )
    )
  );

  return <Comp {...props} resizing={ResizingBehavior.AspectFit} />;
};

export const Heart = props => {
  const BtnFavorite = gtPcPressable(BtnFavorite_isPressed);
  return <BtnFavorite style={{ width: 20, height: 20 }} {...props} />;
};

BtnPrevious.propTypes = {
  size: SizePropType,
  resizing: ResizingBehaviorPropType
};

BtnRewind.propTypes = {
  size: SizePropType,
  resizing: ResizingBehaviorPropType
};

BtnPlay.propTypes = {
  size: SizePropType,
  resizing: ResizingBehaviorPropType
};

BtnForward.propTypes = {
  size: SizePropType,
  resizing: ResizingBehaviorPropType
};

BtnNext.propTypes = {
  size: SizePropType,
  resizing: ResizingBehaviorPropType
};
