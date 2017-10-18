import React from "react";
import { TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import { gtPcSizeable } from "./lib";
import { BtnFavorite_targetFrame_resizing_isPressed } from "./styleKitComponents";
import { ResizingBehavior } from "./lib";

export const BtnHeart = props => {
  const Comp = gtPcSizeable(BtnFavorite_targetFrame_resizing_isPressed);

  return (
    <TouchableOpacity onPress={props.onPress}>
      <Comp
        {...props}
        resizing={ResizingBehavior.AspectFit}
        isPressed={props.isOn === true}
      />
    </TouchableOpacity>
  );
};

BtnHeart.propTypes = {
  isOn: PropTypes.bool,
  onPress: PropTypes.func.isRequired
};
