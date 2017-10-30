import React from "react";
import { TouchableOpacity } from "react-native";
import { gtPcPressable, gtPcColorable } from "./lib";
import {
  BtnLibrary_isPressed_redValue_greenValue_blueValue,
  BtnDetails_isPressed,
  BtnHome_isHome
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

export const BtnDetails = props => {
  const Comp = gtPcPressable(BtnDetails_isPressed);

  return <Comp {...props} />;
};
