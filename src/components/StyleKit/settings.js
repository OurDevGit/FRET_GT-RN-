import React from "react";
import { TouchableOpacity } from "react-native";
import { gtPcPressable, gtPcColorable, gtPcSizeable } from "./lib";
import {
  BtnMail_targetFrame_resizing,
  BtnMailSignup_targetFrame_resizing,
  BtnMailContest_targetFrame_resizing
} from "./styleKitComponents";
import { ResizingBehavior } from "./lib";

export const BtnEmail = props => {
  const BtnEmailComp = gtPcSizeable(
    gtPcColorable(BtnMail_targetFrame_resizing)
  );

  return <BtnEmailComp {...props} resizing={ResizingBehavior.AspectFit} />;
};

export const BtnEmailSignup = props => {
  const BtnEmailSignupComp = gtPcSizeable(
    gtPcColorable(BtnMailSignup_targetFrame_resizing)
  );

  return (
    <BtnEmailSignupComp {...props} resizing={ResizingBehavior.AspectFit} />
  );
};

export const BtnContestSignup = props => {
  const BtnContestSignupComp = gtPcSizeable(
    gtPcColorable(BtnMailContest_targetFrame_resizing)
  );

  return (
    <BtnContestSignupComp {...props} resizing={ResizingBehavior.AspectFit} />
  );
};
