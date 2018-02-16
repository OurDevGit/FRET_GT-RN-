import React from "react";
import PropTypes from "prop-types";
import { TouchableOpacity } from "react-native";
import { gtPcPressable, gtPcColorable, gtPcSizeable } from "./lib";
import {
  BtnLibrary_isPressed_redValue_greenValue_blueValue,
  BtnHome_isHome,
  BtnSettings_isPressed,
  BtnChordsAndScales_targetFrame_resizing_isChordsAndScales
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

export const BtnDetails = props => {
  const Comp = gtPcPressable(BtnDetails_isPressed);

  return <Comp {...props} />;
};

export const BtnChordsAndScales = props => {
  const BtnChordsAndScalesComp = gtPcPressable(
    gtPcSizeable(BtnChordsAndScales_targetFrame_resizing_isChordsAndScales)
  );
  return (
    <BtnChordsAndScalesComp {...props} resizing={ResizingBehavior.AspectFit} />
  );
};

BtnHome.propTypes = {
  onPress: PropTypes.func.isRequired
};
