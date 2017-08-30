import React, { Component } from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import { gtPcPressable, gtPcColorable, gtPcSizeable } from "./lib";
import {
  BtnPrevious_targetFrame_resizing_isPressed_redValue_greenValue_blueValue,
  BtnLoopLeft_targetFrame_resizing_isEnabled,
  BtnLoopRight_targetFrame_resizing_isEnabled,
  BtnLoopLeftCompact_targetFrame_resizing_isEnabled,
  BtnLoopRightCompact_targetFrame_resizing_isEnabled,
  BtnDelete_targetFrame_resizing_isPressed_redValue_greenValue_blueValue
} from "./styleKitComponents";
import {
  ResizingBehavior,
  SizePropType,
  ResizingBehaviorPropType
} from "./lib";

export const LoopLeft = props => {
  const Comp = gtPcSizeable(
    gtPcPressable(BtnLoopLeft_targetFrame_resizing_isEnabled)
  );
  return <Comp {...props} resizing={ResizingBehavior.AspectFit} />;
};

export const LoopRight = props => {
  const Comp = gtPcSizeable(
    gtPcPressable(BtnLoopRight_targetFrame_resizing_isEnabled)
  );
  return <Comp {...props} resizing={ResizingBehavior.AspectFit} />;
};

export const LoopLeftCompact = props => {
  const Comp = gtPcSizeable(
    gtPcPressable(BtnLoopLeftCompact_targetFrame_resizing_isEnabled)
  );
  return <Comp {...props} resizing={ResizingBehavior.AspectFit} />;
};

export const LoopRightCompact = props => {
  const Comp = gtPcSizeable(
    gtPcPressable(BtnLoopRightCompact_targetFrame_resizing_isEnabled)
  );
  return <Comp {...props} resizing={ResizingBehavior.AspectFit} />;
};

export const BtnLoopDelete = props => {
  const Comp = gtPcSizeable(
    gtPcColorable(
      gtPcPressable(
        BtnDelete_targetFrame_resizing_isPressed_redValue_greenValue_blueValue
      )
    )
  );

  return <Comp {...props} resizing={ResizingBehavior.AspectFit} />;
};
