import React, { Component } from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import { gtPcPressable, gtPcColorable, gtPcSizeable } from "./lib";
import {
  BtnPrevious_targetFrame_resizing_isPressed_redValue_greenValue_blueValue,
  BtnRewind_targetFrame_resizing_isPressed_redValue_greenValue_blueValue,
  BtnPlay_targetFrame_resizing_isPressed_isShowingPause_redValue_greenValue_blueValue,
  BtnForward_targetFrame_resizing_isPressed_redValue_greenValue_blueValue,
  BtnNext_targetFrame_resizing_isPressed_redValue_greenValue_blueValue,
  BtnInfo_targetFrame_resizing_isPressed_redValue_greenValue_blueValue,
  BtnStepPrev_targetFrame_resizing_isPressed,
  BtnStepNext_targetFrame_resizing_isPressed,
  BtnFullscreen_targetFrame_resizing_isPressed_redValue_greenValue_blueValue,
  BtnExitFullscreen_targetFrame_resizing_isPressed_redValue_greenValue_blueValue,
  BtnFretboard_targetFrame_resizing_isPressed
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

export const BtnFretlightInfo = props => {
  const Comp = gtPcSizeable(
    gtPcColorable(
      gtPcPressable(
        BtnInfo_targetFrame_resizing_isPressed_redValue_greenValue_blueValue
      )
    )
  );

  return <Comp {...props} resizing={ResizingBehavior.AspectFit} />;
};

export const BtnPrevStep = props => {
  const Comp = gtPcSizeable(
    gtPcPressable(BtnStepPrev_targetFrame_resizing_isPressed)
  );

  return <Comp {...props} resizing={ResizingBehavior.AspectFit} />;
};

export const BtnNextStep = props => {
  const Comp = gtPcSizeable(
    gtPcPressable(BtnStepNext_targetFrame_resizing_isPressed)
  );

  return <Comp {...props} resizing={ResizingBehavior.AspectFit} />;
};

export const BtnVideoFullScreen = props => {
  const Comp = gtPcSizeable(
    gtPcColorable(
      gtPcPressable(
        BtnFullscreen_targetFrame_resizing_isPressed_redValue_greenValue_blueValue
      )
    )
  );
  return <Comp {...props} resizing={ResizingBehavior.AspectFit} />;
};

export const BtnVideoExitFullScreen = props => {
  const Comp = gtPcSizeable(
    gtPcColorable(
      gtPcPressable(
        BtnExitFullscreen_targetFrame_resizing_isPressed_redValue_greenValue_blueValue
      )
    )
  );
  return <Comp {...props} resizing={ResizingBehavior.AspectFit} />;
};

export const BtnToggleFretboard = props => {
  const Comp = gtPcSizeable(
    gtPcColorable(gtPcPressable(BtnFretboard_targetFrame_resizing_isPressed))
  );
  return <Comp {...props} resizing={ResizingBehavior.AspectFit} />;
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

BtnFretlightInfo.propTypes = {
  size: SizePropType,
  resizing: ResizingBehaviorPropType
};

BtnPrevStep.propTypes = {
  size: SizePropType,
  resizing: ResizingBehaviorPropType
};

BtnNextStep.propTypes = {
  size: SizePropType,
  resizing: ResizingBehaviorPropType
};

BtnVideoFullScreen.propTypes = {
  size: SizePropType,
  resizing: ResizingBehaviorPropType
};

BtnVideoExitFullScreen.propTypes = {
  size: SizePropType,
  resizing: ResizingBehaviorPropType
};

BtnToggleFretboard.propTypes = {
  size: SizePropType,
  resizing: ResizingBehaviorPropType
};
