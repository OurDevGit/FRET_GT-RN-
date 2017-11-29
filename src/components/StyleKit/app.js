import React from "react";
import { TouchableOpacity } from "react-native";
import { gtPcPressable, gtPcColorable } from "./lib";
import {
  BtnLibrary_isPressed_redValue_greenValue_blueValue,
  BtnHome_isHome,
  BtnSettings_isPressed
} from "./styleKitComponents";
import { ResizingBehavior } from "./lib";

export const BtnLibrary = props => {
  const BtnLibraryComp = gtPcColorable(
    gtPcPressable(BtnLibrary_isPressed_redValue_greenValue_blueValue)
  );

  return <BtnLibraryComp {...props} resizing={ResizingBehavior.AspectFit} />;
};

export const BtnHome = ({ onPress, ...rest }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <BtnHome_isHome isHome={false} {...rest} />
    </TouchableOpacity>
  );
};

export const BtnSettings = props => {
  const BtnSettingsComp = gtPcPressable(BtnSettings_isPressed);

  return <BtnSettingsComp {...props} resizing={ResizingBehavior.AspectFit} />;
};
