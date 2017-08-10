import PropTypes from "prop-types";
import { requireNativeComponent, View, ViewPropTypes } from "react-native";

var iface = {
  name: "BSTestView",
  propTypes: {
    drawMethod: PropTypes.string.isRequired,
    drawArgs: PropTypes.array,
    ...ViewPropTypes
  }
};

module.exports = requireNativeComponent("RCTBsTestView", iface);
