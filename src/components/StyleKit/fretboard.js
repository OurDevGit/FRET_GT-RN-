import React from "react";
import { gtPcSizeable } from "./lib";
import {
  Capo_targetFrame_resizing,
  BtnTuner_targetFrame_resizing
} from "./styleKitComponents";
import { ResizingBehavior } from "./lib";

export const FretCapo = props => {
  const FretCapoComp = gtPcSizeable(Capo_targetFrame_resizing);

  return <FretCapoComp {...props} resizing={ResizingBehavior.Stretch} />;
};

export const TunerButton = props => {
  const TunerButtonComp = gtPcSizeable(BtnTuner_targetFrame_resizing);

  return <TunerButtonComp {...props} resizing={ResizingBehavior.AspectFit} />;
};
