import React, { Component } from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import { gtPcPressable, gtPcColorable, gtPcSizeable } from "./lib";
import {
  Capo_targetFrame_resizing,
  BtnTuner_targetFrame_resizing_hasAlternateTuning
} from "./styleKitComponents";
import {
  ResizingBehavior,
  SizePropType,
  ResizingBehaviorPropType
} from "./lib";

export const FretCapo = props => {
  const FretCapoComp = gtPcSizeable(Capo_targetFrame_resizing);

  return <FretCapoComp {...props} resizing={ResizingBehavior.Stretch} />;
};

export const TunerButton = props => {
  const TunerButtonComp = gtPcSizeable(
    BtnTuner_targetFrame_resizing_hasAlternateTuning
  );

  return <TunerButtonComp {...props} resizing={ResizingBehavior.AspectFit} />;
};
