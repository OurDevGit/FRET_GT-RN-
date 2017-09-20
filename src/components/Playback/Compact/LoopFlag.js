import React from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import { pure } from "recompose";
import { LoopLeftCompact, LoopRightCompact } from "../../StyleKit";

const flagSize = { width: 24, height: 12 };

const LoopFlag = ({ type, left, isEnabled }) => (
  <View
    style={{
      position: "absolute",
      bottom: 0,
      left: type === "begin" ? left - 1 : left - 23,
      width: flagSize.width,
      height: flagSize.height
    }}
  >
    {type === "begin" ? (
      <LoopLeftCompact isEnabled={isEnabled} style={flagSize} />
    ) : (
      <LoopRightCompact isEnabled={isEnabled} style={flagSize} />
    )}
  </View>
);

LoopFlag.propTypes = {
  type: PropTypes.string.isRequired,
  left: PropTypes.number.isRequired,
  isEnabled: PropTypes.bool.isRequired
};

export default pure(LoopFlag);
