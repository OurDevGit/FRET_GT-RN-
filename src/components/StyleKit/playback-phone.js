import React, { Component } from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import { gtPcPressable, gtPcColorable, gtPcSizeable } from "./lib";
import {
  PhoneTempo_targetFrame_resizing_isPressed_redValue_greenValue_blueValue,
  PhoneBtnLoopToggle_targetFrame_resizing_isPressed_redValue_greenValue_blueValue_loopsEnabled,
  PhoneBtnLoopSave_targetFrame_resizing_isPressed_redValue_greenValue_blueValue,
  PhoneBtnMyLoops_targetFrame_resizing_isPressed_redValue_greenValue_blueValue,
  PhoneBluetooth_targetFrame_resizing_isPressed_redValue_greenValue_blueValue,
  PhoneVolume_targetFrame_resizing
} from "./styleKitComponents";
import {
  ResizingBehavior,
  SizePropType,
  ResizingBehaviorPropType
} from "./lib";

export const BtnPhoneTempo = props => {
  const Comp = gtPcSizeable(
    gtPcColorable(
      PhoneTempo_targetFrame_resizing_isPressed_redValue_greenValue_blueValue
    )
  );

  return (
    <Comp {...props} isPressed={false} resizing={ResizingBehavior.AspectFit} />
  );
};

export const BtnPhoneLoopToggle = props => {
  const Comp = gtPcSizeable(
    gtPcColorable(
      gtPcPressable(
        PhoneBtnLoopToggle_targetFrame_resizing_isPressed_redValue_greenValue_blueValue_loopsEnabled
      )
    )
  );

  return <Comp {...props} resizing={ResizingBehavior.AspectFit} />;
};

export const BtnPhoneLoopSave = props => {
  const Comp = gtPcSizeable(
    gtPcColorable(
      gtPcPressable(
        PhoneBtnLoopSave_targetFrame_resizing_isPressed_redValue_greenValue_blueValue
      )
    )
  );

  return <Comp {...props} resizing={ResizingBehavior.AspectFit} />;
};

export const BtnPhoneMyLoops = props => {
  const Comp = gtPcSizeable(
    gtPcColorable(
      gtPcPressable(
        PhoneBtnMyLoops_targetFrame_resizing_isPressed_redValue_greenValue_blueValue
      )
    )
  );

  return <Comp {...props} resizing={ResizingBehavior.AspectFit} />;
};

export const BtnPhoneBluetooth = props => {
  const Comp = gtPcSizeable(
    gtPcColorable(
      gtPcPressable(
        PhoneTempo_targetFrame_resizing_isPressed_redValue_greenValue_blueValue
      )
    )
  );

  return <Comp {...props} resizing={ResizingBehavior.AspectFit} />;
};

export const PhoneVolumeIcon = props => {
  const Comp = gtPcSizeable(PhoneVolume_targetFrame_resizing);

  return <Comp {...props} resizing={ResizingBehavior.AspectFit} />;
};

BtnPhoneTempo.propTypes = {
  size: SizePropType,
  resizing: ResizingBehaviorPropType
};
BtnPhoneLoopToggle.propTypes = {
  size: SizePropType,
  resizing: ResizingBehaviorPropType
};
BtnPhoneLoopSave.propTypes = {
  size: SizePropType,
  resizing: ResizingBehaviorPropType
};
BtnPhoneMyLoops.propTypes = {
  size: SizePropType,
  resizing: ResizingBehaviorPropType
};
BtnPhoneBluetooth.propTypes = {
  size: SizePropType,
  resizing: ResizingBehaviorPropType
};
PhoneVolumeIcon.propTypes = {
  size: SizePropType,
  resizing: ResizingBehaviorPropType
};
